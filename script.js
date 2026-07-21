/* =====================================================
   Bamburi Cement Kenya
   script.js - Main Interactive Features
   ===================================================== */

// ============================================
// 2. QUOTE CART SYSTEM (localStorage)
// ============================================
const QUOTE_KEY = 'bamburi_quote_cart';

// Note: cart UI (open/close + rendering) is implemented in index.html inline script.
// This file keeps only the cart data layer (add/remove/get) and badge/toast helpers.

window.getQuoteCart = function() {
    try {
        const data = localStorage.getItem(QUOTE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

window.saveQuoteCart = function(cart) {
    localStorage.setItem(QUOTE_KEY, JSON.stringify(cart));
    window.updateQuoteBadge();
    document.dispatchEvent(new CustomEvent('cartUpdated'));
};

window.addToQuoteCart = function(productId) {
    const cart = window.getQuoteCart();
    const existing = cart.find(item => item.id == productId);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        if (typeof products !== 'undefined') {
            const product = products.find(p => p.id == productId);
            if (product) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            } else {
                console.warn('Product not found:', productId);
                return;
            }
        } else {
            console.warn('Products array not loaded');
            return;
        }
    }
    window.saveQuoteCart(cart);
    return cart;
};

window.removeFromQuoteCart = function(productId) {
    let cart = window.getQuoteCart();
    cart = cart.filter(item => item.id != productId);
    window.saveQuoteCart(cart);
    return cart;
};

window.updateQuoteBadge = function() {
    const cart = window.getQuoteCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badge = document.querySelector('.quote-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }
};

window.showToast = function(message) {
    // fallback toast if page doesn't define toast container.
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// ============================================
// 3. ADD TO CART (global function for onclick)
// ============================================
window.addToCart = function(name, price, waLink) {
window.openQuoteCartPanel = function () {
    const overlay = document.getElementById('cartOverlay');
    const panel = document.getElementById('cartPanel');
    if (!overlay || !panel) return false;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    return true;
};
    const toast = document.getElementById('toastNotification');
    if (toast) {
        toast.textContent = `Added to quote cart: ${name} (KES ${price.toLocaleString()})`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    if (typeof window.addToQuoteCart === 'function' && typeof products !== 'undefined') {
        const product = products.find(p => p.name === name || name.includes(p.name));
        if (product) {
            window.addToQuoteCart(product.id);
            window.openQuoteCartPanel();
            return;
        }
    }

    setTimeout(() => {
        window.openQuoteCartPanel();
        window.open(waLink, '_blank');
    }, 800);
};

// ============================================
// 4. RECENTLY VIEWED PRODUCTS
// ============================================
const RECENT_KEY = 'bamburi_recently_viewed';
const MAX_RECENT = 6;


window.getRecentlyViewed = function() {
    try {
        const data = localStorage.getItem(RECENT_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

window.saveRecentlyViewed = function(productId) {
    if (!productId) return;
    let recent = window.getRecentlyViewed();
    recent = recent.filter(id => id != productId);
    recent.unshift(productId);
    if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    if (typeof window.renderRecentlyViewed === 'function') window.renderRecentlyViewed();
};

window.renderRecentlyViewed = function() {
    const container = document.getElementById('recentlyViewed');
    if (!container) return;
    const recentIds = window.getRecentlyViewed();
    if (recentIds.length === 0) {
        container.innerHTML = `<p class="text-muted" style="text-align:center; padding: 2rem 0;">No products viewed yet. Browse our products!</p>`;
        return;
    }
    if (typeof products === 'undefined') {
        container.innerHTML = `<p class="text-muted">Loading...</p>`;
        return;
    }
    const recentProducts = recentIds
        .map(id => products.find(p => p.id == id))
        .filter(p => p !== undefined);

    if (recentProducts.length === 0) {
        container.innerHTML = `<p class="text-muted" style="text-align:center; padding: 2rem 0;">No products viewed yet.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="products-grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
            ${recentProducts.map(product => {
                let stockClass = '';
                let stockText = product.stock || 'In Stock';
                if (stockText === 'In Stock') stockClass = 'in-stock';
                else if (stockText === 'Low Stock') stockClass = 'low-stock';
                else if (stockText === 'Out of Stock') stockClass = 'out-of-stock';
                else stockClass = 'in-stock';
                return `
                    <div class="product-card" style="border: 2px solid var(--brand-primary-light);">
                        <div class="product-image" style="padding-top: 75%;">
                            <img src="${product.image}" alt="${product.name}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;">
                            <span class="stock-badge ${stockClass}">${stockText}</span>
                        </div>
                        <div class="product-body" style="padding: 0.75rem;">
                            <h4 style="font-size: var(--text-sm);"><a href="${product.link}">${product.name}</a></h4>
                            <div class="price-row">
                                ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span><span class="sale-price">${product.price}</span>` : `<span class="regular-price">${product.price}</span>`}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
};

// ============================================
// 5. "YOU MAY ALSO LIKE" RECOMMENDATIONS
// ============================================
window.getRecommendations = function(currentProductId, limit = 4) {
    if (typeof products === 'undefined') return [];
    const others = products.filter(p => p.id != currentProductId);
    for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
    }
    return others.slice(0, limit);
};

window.renderRecommendations = function(productId) {
    const container = document.getElementById('youMayAlsoLike');
    if (!container) return;
    if (!productId || typeof products === 'undefined') {
        container.innerHTML = '';
        return;
    }
    const recs = window.getRecommendations(productId, 4);
    if (recs.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="products-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
            ${recs.map(product => {
                let stockClass = '';
                let stockText = product.stock || 'In Stock';
                if (stockText === 'In Stock') stockClass = 'in-stock';
                else if (stockText === 'Low Stock') stockClass = 'low-stock';
                else if (stockText === 'Out of Stock') stockClass = 'out-of-stock';
                else stockClass = 'in-stock';
                return `
                    <div class="product-card">
                        <div class="product-image" style="padding-top: 75%;">
                            <img src="${product.image}" alt="${product.name}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;">
                            <span class="stock-badge ${stockClass}">${stockText}</span>
                        </div>
                        <div class="product-body" style="padding: 0.75rem;">
                            <h4 style="font-size: var(--text-sm);"><a href="${product.link}">${product.name}</a></h4>
                            <div class="price-row">
                                ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span><span class="sale-price">${product.price}</span>` : `<span class="regular-price">${product.price}</span>`}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
};

// ============================================
// DOMContentLoaded - Interactive Features
// ============================================
document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body;

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            body.classList.toggle('no-scroll');
        });

        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') &&
                !nav.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                body.classList.remove('no-scroll');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        nav.querySelectorAll('.nav-link, .mega-menu a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 991) {
                    nav.classList.remove('active');
                    body.classList.remove('no-scroll');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // --- Shared mobile site-shell menu ---
    const shellMenu = document.querySelector('#siteShellHeader .shell-menu');
    const shellLinks = document.querySelector('#siteShellHeader .shell-links');
    if (shellMenu && shellLinks) {
        const closeShellMenu = () => {
            shellLinks.classList.remove('is-open');
            shellMenu.setAttribute('aria-expanded', 'false');
            shellMenu.setAttribute('aria-label', 'Open navigation menu');
            shellMenu.querySelector('i')?.classList.replace('fa-times', 'fa-bars');
        };
        shellMenu.addEventListener('click', () => {
            const isOpen = shellLinks.classList.toggle('is-open');
            shellMenu.setAttribute('aria-expanded', String(isOpen));
            shellMenu.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            shellMenu.querySelector('i')?.classList.toggle('fa-bars', !isOpen);
            shellMenu.querySelector('i')?.classList.toggle('fa-times', isOpen);
        });
        shellLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeShellMenu));
        window.addEventListener('resize', () => { if (window.innerWidth > 800) closeShellMenu(); });
    }
    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(button => {
        // Blog uses its own accessible accordion controller; do not toggle it twice.
        if (button.closest('.blog-faq')) return;

        button.addEventListener('click', function() {
            const parent = this.parentElement;
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== parent) item.classList.remove('active');
            });
            parent.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-plus');
                icon.classList.toggle('fa-minus');
            }
        });
    });

    // --- Scroll to Top ---
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            scrollTopBtn.classList.toggle('show', window.scrollY > 400);
        });
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Header Shadow ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Counter Animation (Intersection Observer) ---
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (counter.dataset.counted === 'true') return;
                    counter.dataset.counted = 'true';
                    const targetText = counter.innerText.trim();
                    const targetNum = parseInt(targetText.replace(/[^0-9]/g, ''));
                    if (isNaN(targetNum)) return;
                    let current = 0;
                    const increment = Math.ceil(targetNum / 40);
                    const speed = 20;
                    const updateCounter = () => {
                        current += increment;
                        if (current >= targetNum) {
                            counter.innerText = targetText;
                            return;
                        }
                        counter.innerText = current + (targetText.includes('+') ? '+' : '');
                        setTimeout(updateCounter, speed);
                    };
                    updateCounter();
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => counterObserver.observe(counter));
    }

    // --- Scroll Reveal ---
    const sections = document.querySelectorAll('.section');
    if (sections.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        sections.forEach(section => revealObserver.observe(section));
    }

    // --- Price Ticker - Pause on Hover ---
    const tickerWrapper = document.querySelector('.ticker-wrapper');
    const tickerTrack = document.querySelector('.ticker-track');
    if (tickerWrapper && tickerTrack) {
        tickerWrapper.addEventListener('mouseenter', function() {
            tickerTrack.style.animationPlayState = 'paused';
        });
        tickerWrapper.addEventListener('mouseleave', function() {
            tickerTrack.style.animationPlayState = 'running';
        });
    }

    // --- Product Search (Desktop) ---
    const searchInput = document.getElementById('productSearch');
    const searchResults = document.getElementById('searchResults');

    if (searchInput && searchResults && typeof products !== 'undefined') {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            if (query.length < 1) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                return;
            }

            const matches = products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );

            if (matches.length === 0) {
                searchResults.innerHTML = `
                    <div class="search-result-item" style="padding: 1rem; text-align: center; color: var(--text-muted);">
                        No products found matching "${query}"
                    </div>
                `;
                searchResults.classList.add('active');
                return;
            }

            searchResults.innerHTML = matches.map(product => {
                let stockClass = '';
                let stockText = product.stock || 'In Stock';
                if (stockText === 'In Stock') stockClass = 'in-stock';
                else if (stockText === 'Low Stock') stockClass = 'low-stock';
                else if (stockText === 'Out of Stock') stockClass = 'out-of-stock';
                else stockClass = 'in-stock';
                return `
                    <a href="${product.link}" class="search-result-item" data-product-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <div class="info">
                            <h4>${product.name}</h4>
                            <span>${product.description.substring(0, 60)}...</span>
                            <span class="stock-badge ${stockClass}">${stockText}</span>
                        </div>
                        <span class="price">${product.price}</span>
                    </a>
                `;
            }).join('');

            searchResults.classList.add('active');
        });

        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    // --- Mobile Search Overlay ---
    const mobileSearchToggle = document.getElementById('mobileSearchToggle');
    const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
    const closeMobileSearch = document.getElementById('closeMobileSearch');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchResults = document.getElementById('mobileSearchResults');

    if (mobileSearchToggle && mobileSearchOverlay) {
        mobileSearchToggle.addEventListener('click', function() {
            mobileSearchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                if (mobileSearchInput) mobileSearchInput.focus();
            }, 200);
        });

        if (closeMobileSearch) {
            closeMobileSearch.addEventListener('click', function() {
                mobileSearchOverlay.classList.remove('active');
                document.body.style.overflow = '';
                if (mobileSearchInput) mobileSearchInput.value = '';
                if (mobileSearchResults) mobileSearchResults.innerHTML = '';
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileSearchOverlay.classList.contains('active')) {
                mobileSearchOverlay.classList.remove('active');
                document.body.style.overflow = '';
                if (mobileSearchInput) mobileSearchInput.value = '';
                if (mobileSearchResults) mobileSearchResults.innerHTML = '';
            }
        });

        if (mobileSearchInput && mobileSearchResults && typeof products !== 'undefined') {
            mobileSearchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                if (query.length < 1) {
                    mobileSearchResults.innerHTML = '';
                    return;
                }

                const matches = products.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query)
                );

                if (matches.length === 0) {
                    mobileSearchResults.innerHTML = `
                        <div class="no-results">
                            No products found matching "${query}"
                        </div>
                    `;
                    return;
                }

                mobileSearchResults.innerHTML = matches.slice(0, 10).map(product => {
                    let stockClass = '';
                    let stockText = product.stock || 'In Stock';
                    if (stockText === 'In Stock') stockClass = 'in-stock';
                    else if (stockText === 'Low Stock') stockClass = 'low-stock';
                    else if (stockText === 'Out of Stock') stockClass = 'out-of-stock';
                    else stockClass = 'in-stock';

                    return `
                        <a href="${product.link}" class="search-result-item">
                            <img src="${product.image}" alt="${product.name}" loading="lazy">
                            <div class="info">
                                <h4>${product.name}</h4>
                                <span>${product.price}</span>
                                <span class="stock-badge ${stockClass}" style="display:inline-block; font-size:0.6rem; padding:0.1rem 0.6rem; border-radius:999px; margin-top:0.2rem;">${stockText}</span>
                            </div>
                            <span class="price">${product.price}</span>
                        </a>
                    `;
                }).join('');
            });
        }

        mobileSearchOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                mobileSearchOverlay.classList.remove('active');
                document.body.style.overflow = '';
                if (mobileSearchInput) mobileSearchInput.value = '';
                if (mobileSearchResults) mobileSearchResults.innerHTML = '';
            }
        });
    }

    // --- Keyboard Accessibility (ESC for desktop search) ---
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                body.classList.remove('no-scroll');
                const icon = menuToggle?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            if (searchResults && searchResults.classList.contains('active')) {
                searchResults.classList.remove('active');
                if (searchInput) searchInput.value = '';
            }
        }
    });

    // --- Initialize Recently Viewed & Recommendations ---
    setTimeout(function() {
        if (typeof products !== 'undefined' && products.length > 0) {
            if (typeof window.renderRecentlyViewed === 'function') window.renderRecentlyViewed();
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            if (typeof window.renderRecommendations === 'function') {
                window.renderRecommendations(randomProduct.id);
            }
        }
    }, 200);

    // --- Initialize Wishlist & Quote Badges ---
    setTimeout(function() {

        if (typeof window.updateQuoteBadge === 'function') window.updateQuoteBadge();
    }, 100);

    // ============================================
    // FLOATING CART PANEL (NEW)
    // ============================================

    // --- DOM Elements ---
    const cartOverlay = document.getElementById('cartOverlay');
    const cartPanel = document.getElementById('cartPanel');
    const cartClose = document.getElementById('cartClose');
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    const cartPanelCount = document.getElementById('cartPanelCount');
    const cartCount = document.getElementById('cartCount');
    const requestQuoteBtn = document.getElementById('cartRequestQuote');

    // --- Open Cart ---
    window.openCart = function() {
        if (!cartOverlay || !cartPanel || !cartBody) return;
        cartOverlay.classList.add('active');
        cartPanel.classList.add('open');
        document.body.style.overflow = 'hidden';
        renderCartItems();
    };

    // --- Close Cart ---
    window.closeCart = function() {
        if (!cartOverlay || !cartPanel) return;
        cartOverlay.classList.remove('active');
        cartPanel.classList.remove('open');
        document.body.style.overflow = '';
    };

    // --- Toggle Cart ---
    window.toggleCart = function() {
        if (!cartPanel) return;
        if (cartPanel.classList.contains('open')) {
            closeCart();
        } else {
            openCart();
        }
    };

    // --- Resolve cart images from either root pages or blog articles ---
    function getCartImagePath(image) {
        const fallback = 'images/hero.jpg';
        const path = image || fallback;
        const isBlogArticle = window.location.pathname.includes('/blog/');
        return isBlogArticle && !/^(?:https?:|\/|\.\.\/)/.test(path) ? '../' + path : path;
    }

    // --- Render Cart Items ---
    function renderCartItems() {
        const cart = window.getQuoteCart ? window.getQuoteCart() : [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

        // Update badges
        if (cartCount) cartCount.textContent = totalItems;
        if (cartPanelCount) cartPanelCount.textContent = `(${totalItems})`;

        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your quote cart is empty</p>
                    <a href="products.html" class="btn btn-primary" onclick="closeCart()">Browse Products</a>
                </div>
            `;
            cartFooter.classList.add('hidden');
            return;
        }

        cartFooter.classList.remove('hidden');

        // Build cart items HTML
        let itemsHtml = '';
        let total = 0;

        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            const subtotal = price * (item.quantity || 1);
            total += subtotal;

            const stockText = 'In Stock';
            const stockClass = 'in-stock';

            itemsHtml += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-image">
                        <img src="${getCartImagePath(item.image)}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <div class="name">${item.name}</div>
                        <div class="price">${item.price}</div>
                        <span class="stock-status ${stockClass}"><i class="fas fa-check-circle"></i> ${stockText}</span>
                    </div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                        <span class="qty-display">${item.quantity || 1}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeCartItem(${index})" aria-label="Remove item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        cartBody.innerHTML = itemsHtml;

        // Update total
        cartTotal.textContent = `KSh ${total.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`;
    }

    // --- Update Cart Quantity ---
    window.updateCartQuantity = function(index, change) {
        const cart = window.getQuoteCart ? window.getQuoteCart() : [];
        if (cart[index]) {
            const newQty = (cart[index].quantity || 1) + change;
            if (newQty <= 0) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = newQty;
            }
            if (window.saveQuoteCart) {
                window.saveQuoteCart(cart);
            }
            renderCartItems();
            updateCartBadge();
        }
    };

    // --- Remove Cart Item ---
    window.removeCartItem = function(index) {
        const cart = window.getQuoteCart ? window.getQuoteCart() : [];
        cart.splice(index, 1);
        if (window.saveQuoteCart) {
            window.saveQuoteCart(cart);
        }
        renderCartItems();
        updateCartBadge();
        if (typeof window.showToast === 'function') {
            window.showToast('Removed from quote cart');
        }
    };

    // --- Update Cart Badge (global) ---
    function updateCartBadge() {
        const cart = window.getQuoteCart ? window.getQuoteCart() : [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (cartCount) cartCount.textContent = totalItems;
        if (cartPanelCount) cartPanelCount.textContent = `(${totalItems})`;
    }

    // --- Request Quotation via WhatsApp ---
    window.requestQuotation = function() {
        const cart = window.getQuoteCart ? window.getQuoteCart() : [];
        if (cart.length === 0) {
            if (typeof window.showToast === 'function') {
                window.showToast('Your cart is empty!');
            }
            return;
        }

        let message = 'Hello! I would like to request a quote for the following products:\n\n';
        let total = 0;

        cart.forEach(item => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            const qty = item.quantity || 1;
            const subtotal = price * qty;
            total += subtotal;
            message += `- ${item.name} x ${qty} = ${item.price} each (Subtotal: KSh ${subtotal.toLocaleString('en-KE', { minimumFractionDigits: 0 })})\n`;
        });
        message += `\nTotal: KSh ${total.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`;
        message += '\n\nDelivery Location: [Enter your location]';
        message += '\nQuantity needed: [Confirm total bags]';
        message += '\n\nPlease send me your best pricing and delivery options.';

        const encoded = encodeURIComponent(message);
        const phone = '254750210207';
        window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    };

    // --- Event Listeners for Cart Panel ---
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }

    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartPanel && cartPanel.classList.contains('open')) {
            closeCart();
        }
    });

    // Cart button toggles panel
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }

    // Request Quote button
    if (requestQuoteBtn) {
        requestQuoteBtn.addEventListener('click', requestQuotation);
    }

    // Initial render of cart items (only if cart UI exists on this page)
    if (cartBody && cartFooter && cartTotal && cartPanel) {
        renderCartItems();
        updateCartBadge();

        // Listen for cart updates (when products are added from other pages)
        document.addEventListener('cartUpdated', function() {
            renderCartItems();
            updateCartBadge();
        });
    }

    
});


// Quote cart is disabled site-wide: remove legacy cart UI from the DOM.
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.cart-btn, .quote-cart-link, .quote-badge, .cart-count, .cart-overlay, .cart-panel, .btn-add-quote, [onclick*="addToCart"], [onclick*="addToQuoteCart"]').forEach(function (element) {
        element.remove();
    });
});
// Shared structured data for blog posts. The data is generated from visible page content only.
(function () {
    const isBlogPost = /\/blog\/[^/]+\.html$/i.test(window.location.pathname);
    if (!isBlogPost) return;

    const cleanText = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const addSchema = (id, data) => {
        if (document.getElementById(id)) return;
        const node = document.createElement('script');
        node.type = 'application/ld+json';
        node.id = id;
        node.textContent = JSON.stringify(data);
        document.head.appendChild(node);
    };
    const pageUrl = window.location.href.split('#')[0];
    const homeUrl = new URL('../index.html', pageUrl).href;
    const blogUrl = new URL('../blog.html', pageUrl).href;
    const headline = cleanText(document.querySelector('h1')?.textContent) || cleanText(document.title);
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const organization = {
        '@type': 'Organization',
        '@id': `${window.location.origin}/bamburicement/#organization`,
        name: 'Bamburi Cement Kenya',
        url: homeUrl,
        logo: `${window.location.origin}/bamburicement/Bamburi_Cement_Logo-84x58.png`
    };

    addSchema('blog-breadcrumb-schema', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: blogUrl },
            { '@type': 'ListItem', position: 3, name: headline, item: pageUrl }
        ]
    });

    const hasArticleSchema = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some((node) => {
        try {
            const value = JSON.parse(node.textContent);
            const types = Array.isArray(value?.['@type']) ? value['@type'] : [value?.['@type']];
            return types.includes('Article') || types.includes('BlogPosting');
        } catch (_) {
            return false;
        }
    });
    if (!hasArticleSchema && headline && description) {
        addSchema('blog-article-schema', {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline,
            description,
            mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
            author: organization,
            publisher: organization
        });
    }

    const faqHeading = Array.from(document.querySelectorAll('h2, h3')).find((node) =>
        /frequently asked questions/i.test(cleanText(node.textContent))
    );
    if (!faqHeading) return;
    const faqSection = faqHeading.closest('section') || faqHeading.parentElement;
    const entities = Array.from(faqSection.querySelectorAll('h3, h4')).filter((node) =>
        node !== faqHeading && /\?$/.test(cleanText(node.textContent))
    ).map((question) => {
        let answerNode = question.nextElementSibling;
        while (answerNode && !cleanText(answerNode.textContent)) answerNode = answerNode.nextElementSibling;
        const answer = answerNode && !/^H[1-6]$/.test(answerNode.tagName) ? cleanText(answerNode.textContent) : '';
        return answer ? {
            '@type': 'Question',
            name: cleanText(question.textContent),
            acceptedAnswer: { '@type': 'Answer', text: answer }
        } : null;
    }).filter(Boolean);
    if (entities.length >= 2) {
        addSchema('blog-faq-schema', {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: entities
        });
    }
}());