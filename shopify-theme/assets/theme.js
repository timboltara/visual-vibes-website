/* =============================================================
   Visual Vibes Theme JS
   Replaces: CartContext, React state, Framer Motion animations
   ============================================================= */

(function () {
  'use strict';

  /* ── Constants ──────────────────────────────────────────────── */
  const FREE_SHIPPING_THRESHOLD = window.vvFreeShipping || 7500; // cents
  const PROMO_DISCOUNT = 0.15;

  /* ── Utilities ──────────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }
  function show(el) { if (el) el.classList.remove('hidden'); }
  function hide(el) { if (el) el.classList.add('hidden'); }
  function money(cents) { return '$' + (cents / 100).toFixed(2); }

  /* ── Scroll shadow on header ────────────────────────────────── */
  (function initHeaderScroll() {
    const header = $('#site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('shadow-sm', window.scrollY > 10);
    }, { passive: true });
  })();

  /* ── Mega Menu ───────────────────────────────────────────────── */
  (function initMegaMenu() {
    const wrap     = $('#mega-menu-wrap');
    const navLinks = $$('.vv-nav-link[data-mega]');
    if (!wrap || navLinks.length === 0) return;

    let megaTimer = null;

    function showPanel(panelId) {
      $$('.vv-mega-panel', wrap).forEach(function (p) { p.classList.add('hidden'); });
      const panel = $('.vv-mega-panel[data-panel="' + panelId + '"]', wrap);
      if (panel) {
        panel.classList.remove('hidden');
        wrap.classList.remove('hidden');
      }
    }

    function hideMega() {
      wrap.classList.add('hidden');
      $$('.vv-mega-panel', wrap).forEach(function (p) { p.classList.add('hidden'); });
    }

    navLinks.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        clearTimeout(megaTimer);
        showPanel(link.dataset.mega);
      });
      link.addEventListener('mouseleave', function (e) {
        // Only start timer if not moving to the mega menu wrap
        megaTimer = setTimeout(hideMega, 180);
      });
    });

    wrap.addEventListener('mouseenter', function () {
      clearTimeout(megaTimer);
    });
    wrap.addEventListener('mouseleave', function () {
      megaTimer = setTimeout(hideMega, 180);
    });

    // Close if clicked outside
    document.addEventListener('click', function (e) {
      if (!$('#site-header').contains(e.target)) hideMega();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideMega();
    });
  })();

  /* ── Mobile Menu ────────────────────────────────────────────── */
  (function initMobileMenu() {
    const openBtn  = $('#mobile-menu-btn');
    const closeBtn = $('#mobile-menu-close');
    const menu     = $('#mobile-menu');
    const backdrop = $('#mobile-menu-backdrop');
    if (!openBtn || !menu) return;

    function openMenu() {
      menu.classList.remove('translate-x-[-100%]');
      show(backdrop);
      document.body.style.overflow = 'hidden';
      openBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      menu.classList.add('translate-x-[-100%]');
      hide(backdrop);
      document.body.style.overflow = '';
      openBtn.setAttribute('aria-expanded', 'false');
    }

    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });

    // Mobile sub-menu expand (For Him / For Her)
    $$('.vv-mobile-expand', menu).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const sub  = btn.closest('.border-b').querySelector('.vv-mobile-submenu');
        const icon = btn.querySelector('.vv-mobile-expand-icon');
        const open = sub && !sub.classList.contains('hidden');
        $$('.vv-mobile-submenu', menu).forEach(function (s) { s.classList.add('hidden'); });
        $$('.vv-mobile-expand-icon', menu).forEach(function (i) { i.style.transform = ''; });
        if (!open && sub) {
          sub.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  })();

  /* ── Search Overlay ─────────────────────────────────────────── */
  (function initSearch() {
    const overlay  = $('#search-overlay');
    const openBtns = $$('#search-btn, #mobile-search-btn');
    const closeBtn = $('#search-close');
    const input    = $('#search-input');
    if (!overlay) return;

    function openSearch() {
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(function () { if (input) input.focus(); }, 100);
    }
    function closeSearch() {
      overlay.classList.add('hidden');
      overlay.style.display = '';
      document.body.style.overflow = '';
    }

    openBtns.forEach(function (btn) { btn.addEventListener('click', openSearch); });
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearch(); });
  })();

  /* ── Cart: Fetch & Render ────────────────────────────────────── */
  var cartState = { items: [], item_count: 0, total_price: 0 };

  function fetchCart() {
    return fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        cartState = cart;
        renderCart(cart);
        updateCartCount(cart.item_count);
        return cart;
      });
  }

  function renderCart(cart) {
    var list        = $('#cart-items-list');
    var empty       = $('#cart-empty-state');
    var footer      = $('#cart-footer');
    var countBubble = $('#drawer-count-bubble');
    if (!list) return;

    if (cart.item_count === 0) {
      show(empty); hide(footer);
      list.innerHTML = '';
      hide(countBubble);
    } else {
      hide(empty); show(footer);
      show(countBubble);
      if (countBubble) countBubble.textContent = cart.item_count;

      list.innerHTML = cart.items.map(function (item) {
        return '<li class="flex gap-3 px-5 py-4">' +
          '<div class="relative w-16 h-16 flex-shrink-0 bg-vv-gray overflow-hidden">' +
            '<img src="' + item.featured_image.url + '" alt="' + item.product_title + '" style="width:64px;height:64px;object-fit:cover;object-position:top;filter:contrast(1.08) brightness(1.04) saturate(1.2);">' +
          '</div>' +
          '<div class="flex-1 min-w-0">' +
            '<p class="font-heading text-[11px] uppercase tracking-widest text-vv-black font-medium leading-tight line-clamp-2">' + item.product_title + '</p>' +
            '<p class="font-body text-xs text-vv-gray-mid mt-0.5">' + item.variant_title.replace('Default Title', '') + '</p>' +
            '<p class="font-heading text-sm text-vv-black font-semibold mt-1">' + money(item.line_price) + '</p>' +
          '</div>' +
          '<button class="vv-remove-item text-gray-300 hover:text-vv-black transition-colors flex-shrink-0 mt-0.5" data-key="' + item.key + '" aria-label="Remove item">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
          '</button>' +
        '</li>';
      }).join('');

      $$('.vv-remove-item', list).forEach(function (btn) {
        btn.addEventListener('click', function () { removeCartItem(btn.dataset.key); });
      });

      updateShippingBar(cart.total_price);

      var subtotalEl   = $('#cart-subtotal');
      var discountedEl = $('#cart-discounted-total');
      var discAmtEl    = $('#cart-discount-amount');
      if (subtotalEl)   subtotalEl.textContent = money(cart.total_price);
      if (discountedEl) discountedEl.textContent = money(cart.total_price * (1 - PROMO_DISCOUNT));
      if (discAmtEl)    discAmtEl.textContent = '−' + money(cart.total_price * PROMO_DISCOUNT);
    }
  }

  function updateShippingBar(totalCents) {
    var wrap      = $('#shipping-bar-wrap');
    var unlocked  = $('#shipping-unlocked');
    var remaining = $('#shipping-remaining');
    var fill      = $('#shipping-bar-fill');
    if (!wrap) return;
    var pct = Math.min((totalCents / FREE_SHIPPING_THRESHOLD) * 100, 100);
    if (fill) fill.style.width = pct + '%';
    if (totalCents >= FREE_SHIPPING_THRESHOLD) {
      hide(wrap); show(unlocked);
    } else {
      show(wrap); hide(unlocked);
      if (remaining) remaining.textContent = money(FREE_SHIPPING_THRESHOLD - totalCents);
    }
  }

  function updateCartCount(count) {
    var bubble   = $('#cart-count-bubble');
    var countTxt = $('#cart-count-text');
    if (!bubble) return;
    if (count > 0) { show(bubble); if (countTxt) countTxt.textContent = count; }
    else hide(bubble);
    var drawerBubble = $('#drawer-count-bubble');
    if (drawerBubble) {
      if (count > 0) { show(drawerBubble); drawerBubble.textContent = count; }
      else hide(drawerBubble);
    }
  }

  function removeCartItem(key) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: 0 })
    }).then(function () { fetchCart(); });
  }

  /* ── Cart Drawer ────────────────────────────────────────────── */
  (function initCartDrawer() {
    var drawer   = $('#cart-drawer');
    var backdrop = $('#cart-backdrop');
    var openBtn  = $('#cart-drawer-btn');
    var closeBtn = $('#cart-close-btn');
    var contBtn  = $('#cart-continue-btn');
    if (!drawer) return;

    function openDrawer() {
      drawer.classList.remove('translate-x-full');
      show(backdrop);
      document.body.style.overflow = 'hidden';
      fetchCart();
    }
    function closeDrawer() {
      drawer.classList.add('translate-x-full');
      hide(backdrop);
      document.body.style.overflow = '';
    }

    if (openBtn)  openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (contBtn)  contBtn.addEventListener('click', closeDrawer);

    window.vvOpenCart  = openDrawer;
    window.vvCloseCart = closeDrawer;
  })();

  /* ── Toast ──────────────────────────────────────────────────── */
  function showToast(msg) {
    var toast    = $('#cart-toast');
    var toastTxt = $('#cart-toast-text');
    if (!toast) return;
    if (toastTxt) toastTxt.textContent = msg || 'Added to bag!';
    toast.classList.remove('translate-y-8', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-8', 'opacity-0');
    }, 3000);
  }

  /* ── Quick Add (cards) ──────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.vv-quick-add-btn');
    if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    var variantId = btn.dataset.variantId;
    if (!variantId) return;

    var origText = btn.textContent;
    btn.textContent = '...';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(variantId), quantity: 1 }] })
    })
    .then(function (r) { return r.json(); })
    .then(function () {
      btn.textContent = '✓';
      fetchCart();
      showToast('Added to bag!');
      setTimeout(function () {
        btn.textContent = origText;
        btn.disabled = false;
      }, 1800);
    })
    .catch(function () {
      btn.textContent = origText;
      btn.disabled = false;
    });
  });

  /* ── Product Page ───────────────────────────────────────────── */
  (function initProductPage() {
    var form = $('#product-form');
    if (!form || !window.vvProduct) return;

    var product  = window.vvProduct;
    var variants = window.vvProductVariants || product.variants;
    var selectedOptions = {};
    var currentVariant  = null;

    /* Social proof */
    var viewing = Math.floor(Math.random() * 13) + 7;
    var viewingBadge  = $('#viewing-badge');
    var lowStockBadge = $('#low-stock-badge');
    var fanFavBadge   = $('#fan-fav-badge');
    if (viewingBadge) viewingBadge.textContent = viewing + ' viewing';
    if (viewing > 15 && lowStockBadge) show(lowStockBadge);
    if (viewing > 16 && fanFavBadge)   show(fanFavBadge);

    /* ── Image Carousel ──────────────────────────────────────── */
    var productImages = window.vvProduct ? window.vvProduct.images : [];
    var currentImageIndex = 0;

    function goToImage(index) {
      if (!productImages.length) return;
      index = Math.max(0, Math.min(index, productImages.length - 1));
      currentImageIndex = index;

      var img      = $('#main-product-img');
      var thumbs   = $$('.vv-thumb');
      var dots     = $$('.vv-carousel-dot');

      if (img && productImages[index]) {
        img.src = productImages[index].src.replace(/\?.*$/, '') + '?width=1200';
      }

      thumbs.forEach(function (t, i) {
        t.classList.toggle('border-vv-black', i === index);
        t.classList.toggle('border-transparent', i !== index);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('bg-vv-black', i === index);
        d.classList.toggle('bg-gray-300', i !== index);
        d.style.width  = i === index ? '20px' : '';
        d.style.borderRadius = '';
      });
    }

    // Thumb clicks
    $$('.vv-thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        goToImage(parseInt(thumb.dataset.index) || 0);
      });
    });

    // Arrow buttons
    var prevBtn = $('#carousel-prev');
    var nextBtn = $('#carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goToImage(currentImageIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToImage(currentImageIndex + 1); });

    // Dot clicks
    $$('.vv-carousel-dot').forEach(function (dot) {
      dot.addEventListener('click', function () { goToImage(parseInt(dot.dataset.index)); });
    });

    // Touch/swipe on main image
    var touchStartX = 0;
    var mainImg = $('#main-product-image');
    if (mainImg) {
      mainImg.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
      mainImg.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? goToImage(currentImageIndex + 1) : goToImage(currentImageIndex - 1);
        }
      });
    }

    /* ── Color Swatches ──────────────────────────────────────── */
    $$('.vv-color-swatch').forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        $$('.vv-color-swatch').forEach(function (s) {
          s.classList.remove('ring-2', 'ring-vv-black', 'scale-110');
          s.classList.add('ring-1', 'ring-gray-200');
        });
        swatch.classList.add('ring-2', 'ring-vv-black', 'scale-110');
        swatch.classList.remove('ring-1', 'ring-gray-200');

        var label = $('#selected-color-label');
        if (label) label.textContent = '— ' + swatch.dataset.color;

        // Update selectedOptions and find variant
        var optName = swatch.dataset.optionName;
        selectedOptions[optName] = swatch.dataset.color;
        currentVariant = findVariant();
        updateProductUI(currentVariant);
      });
    });

    /* ── Option Selector ─────────────────────────────────────── */
    $$('.vv-option-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var optName  = btn.dataset.optionName;
        var optValue = btn.dataset.optionValue;

        $$('.vv-option-btn[data-option-name="' + optName + '"]').forEach(function (b) {
          b.classList.remove('border-vv-black', 'bg-vv-black', 'text-white');
          b.classList.add('border-gray-200', 'text-vv-black');
        });
        btn.classList.add('border-vv-black', 'bg-vv-black', 'text-white');
        btn.classList.remove('border-gray-200', 'text-vv-black');

        selectedOptions[optName] = optValue;
        var labelEl = $('#selected-' + optName.toLowerCase().replace(/\s+/g, '-') + '-label');
        if (labelEl) labelEl.textContent = '— ' + optValue;

        currentVariant = findVariant();
        updateProductUI(currentVariant);
      });
    });

    function findVariant() {
      return variants.find(function (v) {
        return Object.entries(selectedOptions).every(function (pair) {
          return v.options.includes(pair[1]);
        });
      });
    }

    function updateProductUI(variant) {
      var priceEl      = $('#product-price');
      var atcBtn       = $('#add-to-cart-btn');
      var atcLabel     = $('#atc-label');
      var variantInput = $('#selected-variant-id');

      var allSelected = product.options.length === Object.keys(selectedOptions).length;

      if (variant && allSelected) {
        if (variantInput) variantInput.value = variant.id;
        if (priceEl)  priceEl.textContent = money(variant.price);
        if (atcBtn)   atcBtn.disabled = !variant.available;
        if (atcLabel) atcLabel.textContent = variant.available ? 'Add to Bag' : 'Sold Out';
        if (variant.featured_image) {
          var imgIdx = productImages.findIndex(function (img) {
            return img.id === variant.featured_image.id;
          });
          if (imgIdx >= 0) goToImage(imgIdx);
        }
      }
    }

    /* ── Add to Cart ─────────────────────────────────────────── */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errorEl     = $('#option-error');
      var allSelected = product.has_only_default_variant || product.options.length === Object.keys(selectedOptions).length;

      if (!allSelected) {
        if (errorEl) { show(errorEl); setTimeout(function () { hide(errorEl); }, 3000); }
        return;
      }

      var variantId = parseInt($('#selected-variant-id').value);
      var atcBtn    = $('#add-to-cart-btn');
      var atcLabel  = $('#atc-label');

      if (atcLabel) atcLabel.textContent = 'Adding...';
      if (atcBtn)   atcBtn.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      })
      .then(function (r) { return r.json(); })
      .then(function () {
        if (atcLabel) atcLabel.textContent = '✓ Added!';
        fetchCart().then(function () {
          if (window.vvOpenCart) window.vvOpenCart();
          setTimeout(function () {
            if (atcLabel) atcLabel.textContent = 'Add to Bag';
            if (atcBtn)   atcBtn.disabled = false;
          }, 2000);
        });
      })
      .catch(function () {
        if (atcLabel) atcLabel.textContent = 'Error — try again';
        if (atcBtn)   atcBtn.disabled = false;
      });
    });

    /* ── Reviews ─────────────────────────────────────────────── */
    var writeBtn  = $('#write-review-btn');
    var reviewWrap = $('#review-form-wrap');
    if (writeBtn && reviewWrap) {
      writeBtn.addEventListener('click', function () {
        reviewWrap.classList.toggle('hidden');
        if (!reviewWrap.classList.contains('hidden')) {
          reviewWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
          writeBtn.textContent = 'Cancel';
        } else {
          writeBtn.textContent = 'Write a Review';
        }
      });
    }

    // Star picker
    var pickedRating = 0;
    $$('.vv-review-star').forEach(function (star) {
      star.addEventListener('mouseenter', function () {
        var r = parseInt(star.dataset.rating);
        $$('.vv-review-star').forEach(function (s, i) {
          s.style.color = i < r ? '#e8622a' : '#d1d5db';
        });
      });
      star.addEventListener('mouseleave', function () {
        $$('.vv-review-star').forEach(function (s, i) {
          s.style.color = i < pickedRating ? '#e8622a' : '#d1d5db';
        });
      });
      star.addEventListener('click', function () {
        pickedRating = parseInt(star.dataset.rating);
        $$('.vv-review-star').forEach(function (s, i) {
          s.style.color = i < pickedRating ? '#e8622a' : '#d1d5db';
        });
        var ratingField = $('#review-rating-field');
        if (ratingField) ratingField.value = pickedRating + ' stars — ';
      });
    });
  })();

  /* ── Recommended products: size selection ────────────────────── */
  document.addEventListener('click', function (e) {
    var sizeBtn = e.target.closest('.vv-rec-size-btn');
    if (!sizeBtn) return;
    e.preventDefault(); e.stopPropagation();

    var productId = sizeBtn.dataset.productId;
    var variantId = sizeBtn.dataset.variantId;

    // Deselect siblings
    var parent = sizeBtn.closest('.vv-fade-up, div');
    $$('.vv-rec-size-btn[data-product-id="' + productId + '"]').forEach(function (b) {
      b.classList.remove('bg-vv-black', 'text-white', 'border-vv-black');
      b.classList.add('border-gray-200', 'text-vv-black');
    });
    sizeBtn.classList.add('bg-vv-black', 'text-white', 'border-vv-black');
    sizeBtn.classList.remove('border-gray-200', 'text-vv-black');

    // Show Add button
    var addBtn = parent ? parent.querySelector('.vv-rec-add-btn') : null;
    if (addBtn) {
      addBtn.classList.remove('hidden');
      addBtn.dataset.variantId = variantId;
    }
  });

  document.addEventListener('click', function (e) {
    var addBtn = e.target.closest('.vv-rec-add-btn');
    if (!addBtn || !addBtn.dataset.variantId) return;
    e.preventDefault(); e.stopPropagation();

    var origText = addBtn.textContent;
    addBtn.textContent = 'Adding...';
    addBtn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(addBtn.dataset.variantId), quantity: 1 }] })
    })
    .then(function (r) { return r.json(); })
    .then(function () {
      addBtn.textContent = '✓ Added!';
      fetchCart();
      showToast('Added to bag!');
      setTimeout(function () {
        addBtn.textContent = origText;
        addBtn.disabled = false;
        addBtn.classList.add('hidden');
      }, 2000);
    })
    .catch(function () {
      addBtn.textContent = origText;
      addBtn.disabled = false;
    });
  });

  /* ── Collection Filter Sidebar ───────────────────────────────── */
  (function initCollectionFilters() {
    var grid = $('#product-grid');
    if (!grid) return;

    var state = { sort: 'featured', cats: [], subcats: [], gender: 'all', sizes: [], priceMin: null, priceMax: null };
    var allItems = $$('.vv-product-item', grid);

    /* Accordion */
    $$('.vv-filter-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var body   = btn.nextElementSibling;
        var isOpen = !body.classList.contains('hidden');
        body.classList.toggle('hidden', isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
        btn.querySelector('.vv-chevron').textContent = isOpen ? '▼' : '▲';
      });
    });

    /* T-Shirt sub-category expand/collapse */
    $$('.vv-subcat-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var parent    = btn.closest('.vv-cat-parent');
        var subBody   = parent ? parent.querySelector('.vv-subcat-body') : null;
        var arrow     = btn.querySelector('.vv-subcat-arrow');
        var isOpen    = subBody && !subBody.classList.contains('hidden');
        if (subBody)  subBody.classList.toggle('hidden', isOpen);
        if (arrow)    arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    /* Sub-category buttons (Classic, Heavyweight, Oversized) */
    $$('.vv-subcat-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var subcat = btn.dataset.subcat;
        var idx    = state.subcats.indexOf(subcat);
        if (idx === -1) state.subcats.push(subcat); else state.subcats.splice(idx, 1);
        var active = state.subcats.includes(subcat);
        var checkbox = btn.querySelector('.vv-checkbox');
        var check    = btn.querySelector('.vv-check');
        if (checkbox) checkbox.classList.toggle('bg-vv-black', active);
        if (checkbox) checkbox.classList.toggle('border-vv-black', active);
        if (check)    check.classList.toggle('hidden', !active);
        applyFilters();
      });
    });

    /* Sort */
    $$('.vv-sort-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.sort = btn.dataset.sort;
        $$('.vv-sort-btn').forEach(function (b) {
          b.querySelector('.vv-radio-dot').classList.toggle('hidden', b !== btn);
          b.querySelector('.vv-radio').classList.toggle('border-vv-black', b === btn);
          b.querySelector('.vv-radio').classList.toggle('border-gray-300', b !== btn);
        });
        applyFilters();
      });
    });

    /* Category */
    $$('.vv-cat-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.cat;
        var idx = state.cats.indexOf(cat);
        if (idx === -1) state.cats.push(cat); else state.cats.splice(idx, 1);
        var active = state.cats.includes(cat);
        var checkbox = btn.querySelector('.vv-checkbox');
        var check    = btn.querySelector('.vv-check');
        if (checkbox) checkbox.classList.toggle('bg-vv-black', active);
        if (checkbox) checkbox.classList.toggle('border-vv-black', active);
        if (check)    check.classList.toggle('hidden', !active);
        applyFilters();
      });
    });

    /* Gender */
    $$('.vv-gender-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.gender = btn.dataset.gender;
        $$('.vv-gender-btn').forEach(function (b) {
          var isActive = b === btn;
          b.querySelector('.vv-radio-dot').classList.toggle('hidden', !isActive);
          b.querySelector('.vv-radio').classList.toggle('border-vv-black', isActive);
          b.querySelector('.vv-radio').classList.toggle('border-gray-300', !isActive);
        });
        applyFilters();
      });
    });

    /* Size */
    $$('.vv-size-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sz  = btn.dataset.size;
        var idx = state.sizes.indexOf(sz);
        if (idx === -1) state.sizes.push(sz); else state.sizes.splice(idx, 1);
        btn.classList.toggle('border-vv-black', state.sizes.includes(sz));
        btn.classList.toggle('bg-vv-black',     state.sizes.includes(sz));
        btn.classList.toggle('text-white',      state.sizes.includes(sz));
        applyFilters();
      });
    });

    /* Price */
    $$('.vv-price-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var alreadyActive = state.priceMin === parseInt(btn.dataset.priceMin);
        state.priceMin = alreadyActive ? null : parseInt(btn.dataset.priceMin);
        state.priceMax = alreadyActive ? null : parseInt(btn.dataset.priceMax);
        $$('.vv-price-btn').forEach(function (b) {
          var isActive = !alreadyActive && b === btn;
          b.querySelector('.vv-radio-dot').classList.toggle('hidden', !isActive);
          b.querySelector('.vv-radio').classList.toggle('border-vv-black', isActive);
          b.querySelector('.vv-radio').classList.toggle('border-gray-300', !isActive);
        });
        applyFilters();
      });
    });

    /* Reset */
    $$('#vv-reset-filters, #reset-filters-empty, #mobile-filter-reset').forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', resetFilters);
    });

    function resetFilters() {
      state = { sort: 'featured', cats: [], subcats: [], gender: 'all', sizes: [], priceMin: null, priceMax: null };
      $$('.vv-radio-dot').forEach(function (d)  { d.classList.add('hidden'); });
      $$('.vv-radio').forEach(function (r)      { r.classList.remove('border-vv-black'); r.classList.add('border-gray-300'); });
      $$('.vv-checkbox').forEach(function (c)   { c.classList.remove('bg-vv-black', 'border-vv-black'); });
      $$('.vv-check').forEach(function (c)      { c.classList.add('hidden'); });
      $$('.vv-size-btn').forEach(function (b)   { b.classList.remove('border-vv-black', 'bg-vv-black', 'text-white'); });
      $$('.vv-subcat-arrow').forEach(function (a) { a.style.transform = ''; });
      $$('.vv-subcat-body').forEach(function (b)  { b.classList.add('hidden'); });
      var featuredBtn = document.querySelector('.vv-sort-btn[data-sort="featured"]');
      if (featuredBtn) {
        featuredBtn.querySelector('.vv-radio-dot').classList.remove('hidden');
        featuredBtn.querySelector('.vv-radio').classList.add('border-vv-black');
      }
      applyFilters();
    }

    function countActiveFilters() {
      return state.cats.length + state.subcats.length + (state.gender !== 'all' ? 1 : 0) + state.sizes.length + (state.priceMin !== null ? 1 : 0);
    }

    function applyFilters() {
      var active    = countActiveFilters();
      var resetWrap = $('#reset-btn-wrap');
      if (resetWrap) resetWrap.classList.toggle('hidden', active === 0);

      $$('#desktop-filter-count, #mobile-filter-count').forEach(function (el) {
        if (active > 0) { show(el); el.textContent = active; } else hide(el);
      });
      var mobileReset = $('#mobile-filter-reset');
      if (mobileReset) mobileReset.classList.toggle('hidden', active === 0);

      var visibleItems = allItems.filter(function (item) {
        var tags    = (item.dataset.tags || '').split(',');
        var price   = parseInt(item.dataset.price || 0);
        var sizes   = (item.dataset.sizes || '').split(',');
        var type    = item.dataset.type || '';

        // Category filter
        if (state.cats.length > 0 && !state.cats.some(function (c) { return type.includes(c) || tags.includes(c); })) return false;

        // Sub-category filter (Classic Fit, Heavyweight, Oversized)
        if (state.subcats.length > 0 && !state.subcats.some(function (sc) { return tags.includes(sc); })) return false;

        // Gender
        if (state.gender === 'mens'   && tags.includes('womens')) return false;
        if (state.gender === 'womens' && tags.includes('mens'))   return false;

        // Sizes
        if (state.sizes.length > 0 && !state.sizes.some(function (s) { return sizes.includes(s); })) return false;

        // Price
        if (state.priceMin !== null && (price < state.priceMin || price > state.priceMax)) return false;

        return true;
      });

      // Sort
      if (state.sort === 'price-asc')  visibleItems.sort(function (a, b) { return parseInt(a.dataset.price) - parseInt(b.dataset.price); });
      if (state.sort === 'price-desc') visibleItems.sort(function (a, b) { return parseInt(b.dataset.price) - parseInt(a.dataset.price); });

      // Show/hide + reorder
      allItems.forEach(function (item) { hide(item); });
      visibleItems.forEach(function (item) { show(item); grid.appendChild(item); });

      var noResults = $('#no-results');
      if (noResults) noResults.classList.toggle('hidden', visibleItems.length > 0);

      var countEl = $('#result-count');
      if (countEl) countEl.textContent = visibleItems.length + ' product' + (visibleItems.length !== 1 ? 's' : '');

      var showBtn = $('#mobile-show-products');
      if (showBtn) showBtn.textContent = 'Show ' + visibleItems.length + ' Products';
    }
  })();

  /* ── Mobile Filter Drawer ────────────────────────────────────── */
  (function initMobileFilters() {
    var openBtn  = $('#mobile-filter-btn');
    var closeBtn = $('#mobile-filter-close');
    var backdrop = $('#mobile-filter-backdrop');
    var drawer   = $('#mobile-filter-drawer');
    var showBtn  = $('#mobile-show-products');
    if (!openBtn || !drawer) return;

    function openFilters() {
      drawer.classList.remove('translate-x-[-100%]');
      show(backdrop);
      document.body.style.overflow = 'hidden';
    }
    function closeFilters() {
      drawer.classList.add('translate-x-[-100%]');
      hide(backdrop);
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openFilters);
    if (closeBtn) closeBtn.addEventListener('click', closeFilters);
    if (backdrop) backdrop.addEventListener('click', closeFilters);
    if (showBtn)  showBtn.addEventListener('click', closeFilters);
  })();

  /* ── Exit Intent Popup ───────────────────────────────────────── */
  (function initExitPopup() {
    var popup      = $('#exit-popup');
    var backdrop   = $('#exit-popup-backdrop');
    var closeBtn   = $('#exit-popup-close');
    var dismissBtn = $('#exit-popup-dismiss');
    var copyBtn    = $('#exit-popup-copy');
    if (!popup) return;
    if (sessionStorage.getItem('vv-exit-shown')) return;

    function showPopup() {
      show(popup); show(backdrop);
      sessionStorage.setItem('vv-exit-shown', '1');
    }
    function closePopup() { hide(popup); hide(backdrop); }

    document.addEventListener('mouseleave', function (e) { if (e.clientY < 20) showPopup(); });
    if (closeBtn)   closeBtn.addEventListener('click', closePopup);
    if (dismissBtn) dismissBtn.addEventListener('click', closePopup);
    if (backdrop)   backdrop.addEventListener('click', closePopup);

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var code = copyBtn.textContent.replace('Copy Code: ', '').trim();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).then(function () {
            copyBtn.textContent = '✓ Copied!';
            setTimeout(function () { copyBtn.textContent = 'Copy Code: ' + code; }, 2000);
          });
        }
      });
    }
  })();

  /* ── Scroll Reveal ───────────────────────────────────────────── */
  (function initScrollReveal() {
    if (!window.IntersectionObserver) return;

    var style = document.createElement('style');
    style.textContent = [
      '.vv-fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }',
      '.vv-fade-up.vv-visible { opacity: 1; transform: translateY(0); }',
      '.vv-fade-up-section { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }',
      '.vv-fade-up-section.vv-visible { opacity: 1; transform: translateY(0); }'
    ].join('\n');
    document.head.appendChild(style);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('vv-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-60px' });

    $$('.vv-fade-up, .vv-fade-up-section').forEach(function (el) { observer.observe(el); });
  })();

  /* ── Init: fetch cart count on page load ─────────────────────── */
  fetch('/cart.js')
    .then(function (r) { return r.json(); })
    .then(function (cart) {
      updateCartCount(cart.item_count);
      cartState = cart;
    });

})();
