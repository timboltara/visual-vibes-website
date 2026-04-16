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

  /* ── Mobile Menu ────────────────────────────────────────────── */
  (function initMobileMenu() {
    const openBtn   = $('#mobile-menu-btn');
    const closeBtn  = $('#mobile-menu-close');
    const menu      = $('#mobile-menu');
    const backdrop  = $('#mobile-menu-backdrop');
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

    // Close on nav link click
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  })();

  /* ── Search Overlay ─────────────────────────────────────────── */
  (function initSearch() {
    const overlay    = $('#search-overlay');
    const openBtns   = $$('#search-btn, #mobile-search-btn');
    const closeBtn   = $('#search-close');
    const input      = $('#search-input');
    if (!overlay) return;

    function openSearch() {
      show(overlay);
      overlay.style.display = 'flex';
      overlay.classList.remove('hidden');
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

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearch();
    });
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
      show(empty);
      hide(footer);
      list.innerHTML = '';
      hide(countBubble);
    } else {
      hide(empty);
      show(footer);
      show(countBubble);
      if (countBubble) countBubble.textContent = cart.item_count;

      list.innerHTML = cart.items.map(function (item) {
        return '<li class="flex gap-3 px-5 py-4">' +
          '<div class="relative w-16 h-16 flex-shrink-0 bg-vv-gray overflow-hidden">' +
            '<img src="' + item.featured_image.url + '" alt="' + item.product_title + '" style="width:64px;height:64px;object-fit:cover;object-position:top;filter:contrast(1.08) brightness(1.04) saturate(1.2);">' +
          '</div>' +
          '<div class="flex-1 min-w-0">' +
            '<p class="font-heading text-[11px] uppercase tracking-widest text-vv-black font-medium leading-tight line-clamp-2">' + item.product_title + '</p>' +
            '<p class="font-body text-xs text-vv-gray-mid mt-0.5">' + item.variant_title.replace('Default Title','') + '</p>' +
            (item.properties && Object.keys(item.properties).length ?
              Object.entries(item.properties).map(function(p){ return '<p class="font-body text-xs text-vv-gray-mid">' + p[0] + ': ' + p[1] + '</p>'; }).join('') : '') +
            '<p class="font-heading text-sm text-vv-black font-semibold mt-1">' + money(item.line_price) + '</p>' +
          '</div>' +
          '<button class="vv-remove-item text-gray-300 hover:text-vv-black transition-colors flex-shrink-0 mt-0.5" data-key="' + item.key + '" aria-label="Remove item">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
          '</button>' +
        '</li>';
      }).join('');

      // Remove item listeners
      $$('.vv-remove-item', list).forEach(function (btn) {
        btn.addEventListener('click', function () {
          removeCartItem(btn.dataset.key);
        });
      });

      // Update shipping bar
      updateShippingBar(cart.total_price);

      // Update totals
      var subtotalEl  = $('#cart-subtotal');
      var discountedEl = $('#cart-discounted-total');
      var discAmtEl   = $('#cart-discount-amount');
      if (subtotalEl) subtotalEl.textContent = money(cart.total_price);
      var discounted = cart.total_price * (1 - PROMO_DISCOUNT);
      if (discountedEl) discountedEl.textContent = money(discounted);
      if (discAmtEl) discAmtEl.textContent = '−' + money(cart.total_price * PROMO_DISCOUNT);
    }
  }

  function updateShippingBar(totalCents) {
    var wrap     = $('#shipping-bar-wrap');
    var unlocked = $('#shipping-unlocked');
    var remaining = $('#shipping-remaining');
    var fill    = $('#shipping-bar-fill');
    if (!wrap) return;

    var pct = Math.min((totalCents / FREE_SHIPPING_THRESHOLD) * 100, 100);
    if (fill) fill.style.width = pct + '%';

    if (totalCents >= FREE_SHIPPING_THRESHOLD) {
      hide(wrap);
      show(unlocked);
    } else {
      show(wrap);
      hide(unlocked);
      if (remaining) remaining.textContent = money(FREE_SHIPPING_THRESHOLD - totalCents);
    }
  }

  function updateCartCount(count) {
    var bubble   = $('#cart-count-bubble');
    var countTxt = $('#cart-count-text');
    if (!bubble) return;
    if (count > 0) {
      show(bubble);
      if (countTxt) countTxt.textContent = count;
    } else {
      hide(bubble);
    }
    // Also update drawer bubble
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

  /* ── Cart Drawer Open/Close ─────────────────────────────────── */
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

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (contBtn) contBtn.addEventListener('click', closeDrawer);

    // Expose globally so product page can open it
    window.vvOpenCart = openDrawer;
    window.vvCloseCart = closeDrawer;
  })();

  /* ── Toast Notification ─────────────────────────────────────── */
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

  /* ── Quick Add to Cart (collection/featured cards) ──────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.vv-quick-add-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var variantId = btn.dataset.variantId;
    var title     = btn.dataset.productTitle;
    if (!variantId) return;

    btn.textContent = '✓';
    btn.classList.add('border-vv-orange', 'bg-vv-orange', 'text-white');

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(variantId), quantity: 1 }] })
    })
    .then(function (r) { return r.json(); })
    .then(function () {
      fetchCart();
      showToast('Added to bag!');
      setTimeout(function () {
        btn.textContent = btn.dataset.origText || btn.getAttribute('data-size') || '✓';
        btn.classList.remove('border-vv-orange', 'bg-vv-orange', 'text-white');
      }, 1500);
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

    /* Social proof badges */
    var viewing = Math.floor(Math.random() * 13) + 7; // 7–19
    var viewingBadge  = $('#viewing-badge');
    var lowStockBadge = $('#low-stock-badge');
    var fanFavBadge   = $('#fan-fav-badge');
    if (viewingBadge) viewingBadge.textContent = viewing + ' viewing';
    if (viewing > 15 && lowStockBadge) show(lowStockBadge);
    if (viewing > 16 && fanFavBadge)   show(fanFavBadge);

    /* Thumbnail gallery */
    $$('.vv-thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var img = $('#main-product-img');
        if (img) img.src = thumb.dataset.imageUrl;
        $$('.vv-thumb').forEach(function (t) { t.classList.remove('border-vv-black'); t.classList.add('border-transparent'); });
        thumb.classList.add('border-vv-black');
        thumb.classList.remove('border-transparent');
      });
    });

    /* Option selector */
    $$('.vv-option-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var optName  = btn.dataset.optionName;
        var optValue = btn.dataset.optionValue;
        var optIndex = parseInt(btn.dataset.optionIndex);

        // Deselect siblings
        $$('.vv-option-btn[data-option-name="' + optName + '"]').forEach(function (b) {
          b.classList.remove('border-vv-black', 'bg-vv-black', 'text-white');
          b.classList.add('border-gray-200', 'text-vv-black');
        });
        btn.classList.add('border-vv-black', 'bg-vv-black', 'text-white');
        btn.classList.remove('border-gray-200', 'text-vv-black');

        selectedOptions[optName] = optValue;

        // Update label
        var labelEl = $('#selected-' + optName.toLowerCase().replace(/\s+/g,'-') + '-label');
        if (labelEl) labelEl.textContent = '— ' + optValue;

        // Find matching variant
        currentVariant = variants.find(function (v) {
          return Object.entries(selectedOptions).every(function (pair) {
            return v.options.includes(pair[1]);
          });
        });

        updateProductUI(currentVariant);
      });
    });

    function updateProductUI(variant) {
      var priceEl  = $('#product-price');
      var atcBtn   = $('#add-to-cart-btn');
      var atcLabel = $('#atc-label');
      var variantInput = $('#selected-variant-id');

      var allSelected = product.options.length === Object.keys(selectedOptions).length;

      if (variant && allSelected) {
        if (variantInput) variantInput.value = variant.id;
        if (priceEl) priceEl.textContent = money(variant.price);
        if (atcBtn) atcBtn.disabled = !variant.available;
        if (atcLabel) atcLabel.textContent = variant.available ? 'Add to Bag' : 'Sold Out';
        // Update image if variant has one
        if (variant.featured_image) {
          var img = $('#main-product-img');
          if (img) img.src = variant.featured_image.src;
        }
      }
    }

    /* Add to Cart submission */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errorEl = $('#option-error');
      var allSelected = product.has_only_default_variant || product.options.length === Object.keys(selectedOptions).length;

      if (!allSelected) {
        if (errorEl) { show(errorEl); setTimeout(function () { hide(errorEl); }, 3000); }
        return;
      }

      var variantId = parseInt($('#selected-variant-id').value);
      var atcBtn    = $('#add-to-cart-btn');
      var atcLabel  = $('#atc-label');

      if (atcLabel) atcLabel.textContent = 'Adding...';
      if (atcBtn) atcBtn.disabled = true;

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
            if (atcBtn) atcBtn.disabled = false;
          }, 2000);
        });
      })
      .catch(function () {
        if (atcLabel) atcLabel.textContent = 'Error — try again';
        if (atcBtn) atcBtn.disabled = false;
      });
    });
  })();

  /* ── Collection Filter Sidebar ───────────────────────────────── */
  (function initCollectionFilters() {
    var grid = $('#product-grid');
    if (!grid) return;

    var state = { sort: 'featured', cats: [], gender: 'all', sizes: [], priceMin: null, priceMax: null };
    var allItems = $$('.vv-product-item', grid);

    /* Filter section accordion */
    $$('.vv-filter-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var body = btn.nextElementSibling;
        var isOpen = !body.classList.contains('hidden');
        body.classList.toggle('hidden', isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
        btn.querySelector('.vv-chevron').textContent = isOpen ? '▼' : '▲';
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
        btn.querySelector('.vv-checkbox').classList.toggle('bg-vv-black', active);
        btn.querySelector('.vv-checkbox').classList.toggle('border-vv-black', active);
        btn.querySelector('.vv-check').classList.toggle('hidden', !active);
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
        var sz = btn.dataset.size;
        var idx = state.sizes.indexOf(sz);
        if (idx === -1) state.sizes.push(sz); else state.sizes.splice(idx, 1);
        btn.classList.toggle('border-vv-black', state.sizes.includes(sz));
        btn.classList.toggle('bg-vv-black', state.sizes.includes(sz));
        btn.classList.toggle('text-white', state.sizes.includes(sz));
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
      state = { sort: 'featured', cats: [], gender: 'all', sizes: [], priceMin: null, priceMax: null };
      $$('.vv-radio-dot').forEach(function (d) { d.classList.add('hidden'); });
      $$('.vv-radio').forEach(function (r) { r.classList.remove('border-vv-black'); r.classList.add('border-gray-300'); });
      $$('.vv-checkbox').forEach(function (c) { c.classList.remove('bg-vv-black','border-vv-black'); });
      $$('.vv-check').forEach(function (c) { c.classList.add('hidden'); });
      $$('.vv-size-btn').forEach(function (b) { b.classList.remove('border-vv-black','bg-vv-black','text-white'); });
      // Reset "Featured" sort radio
      var featuredBtn = document.querySelector('.vv-sort-btn[data-sort="featured"]');
      if (featuredBtn) {
        featuredBtn.querySelector('.vv-radio-dot').classList.remove('hidden');
        featuredBtn.querySelector('.vv-radio').classList.add('border-vv-black');
      }
      applyFilters();
    }

    function countActiveFilters() {
      return state.cats.length + (state.gender !== 'all' ? 1 : 0) + state.sizes.length + (state.priceMin !== null ? 1 : 0);
    }

    function applyFilters() {
      var active = countActiveFilters();
      var resetWrap = $('#reset-btn-wrap');
      if (resetWrap) resetWrap.classList.toggle('hidden', active === 0);

      // Filter count badges
      $$('#desktop-filter-count, #mobile-filter-count').forEach(function (el) {
        if (active > 0) { show(el); el.textContent = active; } else hide(el);
      });
      var mobileReset = $('#mobile-filter-reset');
      if (mobileReset) mobileReset.classList.toggle('hidden', active === 0);

      var visibleItems = allItems.filter(function (item) {
        var tags  = (item.dataset.tags || '').split(',');
        var price = parseInt(item.dataset.price || 0);
        var sizes = (item.dataset.sizes || '').split(',');
        var type  = item.dataset.type || '';

        // Category
        if (state.cats.length > 0 && !state.cats.some(function (c) { return type.includes(c) || tags.includes(c); })) return false;

        // Gender
        if (state.gender === 'mens'   && tags.includes('womens')) return false;
        if (state.gender === 'womens' && tags.includes('mens'))   return false;

        // Sizes
        if (state.sizes.length > 0 && !state.sizes.some(function (s) { return sizes.includes(s); })) return false;

        // Price (Shopify prices in cents)
        if (state.priceMin !== null && (price < state.priceMin || price > state.priceMax)) return false;

        return true;
      });

      // Sort
      if (state.sort === 'price-asc')
        visibleItems.sort(function (a, b) { return parseInt(a.dataset.price) - parseInt(b.dataset.price); });
      else if (state.sort === 'price-desc')
        visibleItems.sort(function (a, b) { return parseInt(b.dataset.price) - parseInt(a.dataset.price); });

      // Show/hide items + reorder
      allItems.forEach(function (item) { hide(item); });
      visibleItems.forEach(function (item) {
        show(item);
        grid.appendChild(item); // reorder by moving to end
      });

      // Empty state
      var noResults = $('#no-results');
      if (noResults) noResults.classList.toggle('hidden', visibleItems.length > 0);

      // Update count
      var countEl = $('#result-count');
      if (countEl) countEl.textContent = visibleItems.length + ' product' + (visibleItems.length !== 1 ? 's' : '');

      // Mobile show button
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
    if (showBtn) showBtn.addEventListener('click', closeFilters);
  })();

  /* ── Exit Intent Popup ───────────────────────────────────────── */
  (function initExitPopup() {
    var popup    = $('#exit-popup');
    var backdrop = $('#exit-popup-backdrop');
    var closeBtn = $('#exit-popup-close');
    var dismissBtn = $('#exit-popup-dismiss');
    var copyBtn  = $('#exit-popup-copy');
    if (!popup) return;

    var shown = sessionStorage.getItem('vv-exit-shown');
    if (shown) return;

    function showPopup() {
      show(popup);
      show(backdrop);
      sessionStorage.setItem('vv-exit-shown', '1');
    }
    function closePopup() {
      hide(popup);
      hide(backdrop);
    }

    // Trigger on mouse leave to top of viewport
    document.addEventListener('mouseleave', function (e) {
      if (e.clientY < 20) showPopup();
    });

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

  /* ── Scroll reveal (replaces Framer Motion) ─────────────────── */
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

    $$('.vv-fade-up, .vv-fade-up-section').forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ── Init: fetch cart count on page load ─────────────────────── */
  fetch('/cart.js')
    .then(function (r) { return r.json(); })
    .then(function (cart) {
      updateCartCount(cart.item_count);
      cartState = cart;
    });

})();
