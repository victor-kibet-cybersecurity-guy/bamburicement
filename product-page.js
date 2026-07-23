function getProductImageDimensions(imagePath) {
    return typeof getImageDimensions === 'function' ? getImageDimensions(imagePath) : { width: 640, height: 946 };
}


        // ============================================
// Removed corrupted legacy comment.
        // ============================================

        function getProductIdFromURL() {
            const params = new URLSearchParams(window.location.search);
            const id = parseInt(params.get('id'));
            return isNaN(id) ? null : id;
        }

        function getProductById(id) {
            if (typeof products === 'undefined') return null;
            return products.find(p => p.id === id) || null;
        }

        function renderProductPage() {
            const productId = getProductIdFromURL();
            const product = productId ? getProductById(productId) : null;

            const loadingState = document.getElementById('loadingState');
            const content = document.getElementById('productContentLoaded');

            if (!product) {
                loadingState.style.display = 'none';
                content.style.display = 'block';
                content.innerHTML = `
                    <div class="not-found">
                        <i class="fas fa-exclamation-circle"></i>
                        <h2>Product Not Found</h2>
                        <p>The product you're looking for doesn't exist or has been removed.</p>
                        <a href="products.html" class="btn btn-primary">Browse All Products</a>
                    </div>
                `;
                document.getElementById('breadcrumbProduct').textContent = 'Product Not Found';
                return;
            }

// Removed corrupted legacy comment.
            loadingState.style.display = 'none';
            content.style.display = 'block';

            // --- Update Page Title & Meta ---
            document.title = `${product.name} | Bamburi Cement PLC`;
            document.querySelector('meta[name="description"]').content =
                `Buy ${product.name} in Kenya at ${product.price}. ${product.description.substring(0, 150)}`;

            // --- Open Graph ---
            document.querySelector('meta[property="og:title"]').content = `${product.name} | Bamburi Cement PLC`;
            document.querySelector('meta[property="og:description"]').content =
                `${product.name} at ${product.price}. ${product.description.substring(0, 150)}`;
            document.querySelector('meta[property="og:image"]').content = product.image;

            // --- Twitter Card ---
            document.querySelector('meta[name="twitter:title"]').content = `${product.name} | Bamburi Cement PLC`;
            document.querySelector('meta[name="twitter:description"]').content =
                `${product.name} at ${product.price}. ${product.description.substring(0, 150)}`;
            document.querySelector('meta[name="twitter:image"]').content = product.image;            // --- JSON-LD Schema ---
            const productUrl = new URL(window.location.href);
            productUrl.searchParams.set('id', product.id);
            const schemaStockText = product.stock || 'In Stock';
            const schemaAvailability = schemaStockText === 'In Stock'
                ? 'https://schema.org/InStock'
                : schemaStockText === 'Low Stock'
                    ? 'https://schema.org/LimitedAvailability'
                    : 'https://schema.org/OutOfStock';
            const schema = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                description: product.description,
                sku: String(product.id),
                url: productUrl.href,
                image: [new URL(product.image, window.location.href).href],
                brand: {
                    '@type': 'Brand',
                    name: 'Bamburi Cement'
                },
                offers: {
                    '@type': 'Offer',
                    url: productUrl.href,
                    priceCurrency: 'KES',
                    price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
                    availability: schemaAvailability,
                    itemCondition: 'https://schema.org/NewCondition',
                    seller: {
                        '@type': 'Organization',
                        name: 'Bamburi Cement PLC'
                    }
                }
            };
            document.getElementById('productSchema').textContent = JSON.stringify(schema);

            // --- Breadcrumb ---
            document.getElementById('breadcrumbProduct').textContent = product.name;

            // --- Gallery ---
            const mainImageElement = document.getElementById('mainImage');
            const mainImageDimensions = getProductImageDimensions(product.image);
            mainImageElement.src = product.image;
            mainImageElement.alt = product.name;
            mainImageElement.width = mainImageDimensions.width;
            mainImageElement.height = mainImageDimensions.height;

            const badgeContainer = document.getElementById('badgeContainer');
            badgeContainer.innerHTML = '';
            if (product.isBestSeller) {
                badgeContainer.innerHTML += `<span class="badge bestseller">Best Seller</span>`;
            }
            if (product.isNew) {
                badgeContainer.innerHTML += `<span class="badge new">New</span>`;
            }
            if (product.isFeatured) {
                badgeContainer.innerHTML += `<span class="badge featured">Featured</span>`;
            }
            if (product.oldPrice) {
                const oldNum = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''));
                const newNum = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                if (!isNaN(oldNum) && !isNaN(newNum) && oldNum > newNum) {
                    badgeContainer.innerHTML += `<span class="badge sale">Sale</span>`;
                }
            }

            // Thumbnails
            const thumbContainer = document.getElementById('galleryThumbs');
            thumbContainer.innerHTML = '';
            const allImages = [product.image, ...(product.extraImages || [])];
            allImages.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img;
                thumb.alt = `${product.name} - view ${index + 1}`;
                if (index === 0) thumb.classList.add('active');
                thumb.dataset.index = index;
                thumb.addEventListener('click', function() {
                    document.getElementById('mainImage').src = this.src;
                    thumbContainer.querySelectorAll('img').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
                thumbContainer.appendChild(thumb);
            });

            // --- Product Info ---
            document.getElementById('productName').textContent = product.name;

            // Rating (simulated)
            document.getElementById('productStars').textContent = '★★★★★';
            document.getElementById('productReviewCount').textContent = '(4.8 / 5.0)';

            // Price
            const priceContainer = document.getElementById('productPrice');
            priceContainer.innerHTML = '';
            if (product.oldPrice) {
                const oldNum = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''));
                const newNum = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                if (!isNaN(oldNum) && !isNaN(newNum) && oldNum > newNum) {
                    const percent = Math.round((1 - newNum / oldNum) * 100);
                    priceContainer.innerHTML = `
                        <span class="current-price sale">${product.price}</span>
                        <span class="old-price">${product.oldPrice}</span>
                        <span class="sale-badge">-${percent}%</span>
                    `;
                } else {
                    priceContainer.innerHTML = `<span class="current-price">${product.price}</span>`;
                }
            } else {
                priceContainer.innerHTML = `<span class="current-price">${product.price}</span>`;
            }

            // Stock
            const stockContainer = document.getElementById('productStock');
            const stockText = product.stock || 'In Stock';
            let stockClass = 'in-stock';
            if (stockText === 'Low Stock') stockClass = 'low-stock';
            else if (stockText === 'Out of Stock') stockClass = 'out-of-stock';
            stockContainer.innerHTML = `
                <span class="${stockClass}">●</span>
                <span>${stockText}${stockText === 'In Stock' ? ' — Ready for delivery' : ''}</span>
            `;

            // Description
            document.getElementById('productDescription').textContent = product.description;

            // Details Grid
            const detailsContainer = document.getElementById('productDetails');
            const details = [
                { label: 'Strength', value: product.strength || 'Standard' },
                { label: 'Category', value: product.category || 'Cement' },
                { label: 'Packaging', value: product.packaging || '50kg bag' },
                { label: 'Brand', value: 'Bamburi Cement' },
                { label: 'Coverage', value: product.coverage || 'Varies by application' },
                { label: 'Recommended Uses', value: product.recommendedUses || 'General construction' },
                { label: 'Weight', value: '50 kg' },
                { label: 'Shelf Life', value: product.shelfLife || '6 months (unopened)' },
            ];
            detailsContainer.innerHTML = details.map(d => `
                <div class="detail-item">
                    <span class="label">${d.label}</span>
                    <span class="value">${d.value}</span>
                </div>
            `).join('');

            // ============================================
// Removed corrupted legacy comment.
            // ============================================

            // --- Description Tab ---
            const descContent = document.getElementById('tabDescriptionContent');
            if (descContent) {
                descContent.textContent = product.description || 'No description available.';
                } else {
                }

            // --- Specifications Tab ---
            const specContent = document.getElementById('tabSpecificationsContent');
            if (specContent) {
                const specs = [
                    `Strength: ${product.strength || 'Standard'} MPa`,
                    `Packaging: ${product.packaging || '50kg bag'}`,
                    `Brand: Bamburi Cement`,
                    `Made in Kenya`,
                    `Quality: ISO certified`,
                ];
                specContent.innerHTML = specs.map(s => `<li>${s}</li>`).join('');
                } else {
                }

            // --- Applications Tab ---
            const appContent = document.getElementById('tabApplicationsContent');
            if (appContent) {
                let apps = [];
                if (product.recommendedUses) {
                    apps = product.recommendedUses.split(',').map(item => item.trim()).filter(item => item.length > 0);
                }
                if (apps.length === 0) {
                    apps = [
                        'General construction',
                        'Foundations and slabs',
                        'Plastering and rendering',
                        'Block and brick laying',
                        'Mortar works'
                    ];
                }
                appContent.innerHTML = apps.map(a => `<li>${a}</li>`).join('');
                } else {
                }

            // --- Product Features ---
            const featuresContainer = document.getElementById('productFeatures');
            const features = [
                { icon: 'fa-certificate', title: '100% Genuine', desc: 'Authorized Bamburi Cement products' },
                { icon: 'fa-truck-fast', title: 'Fast Delivery', desc: 'Nationwide delivery across Kenya' },
                { icon: 'fa-tags', title: 'Competitive Price', desc: 'Best prices for quality cement' },
                { icon: 'fa-headset', title: 'Expert Support', desc: 'Professional sales guidance' },
            ];
            if (featuresContainer) {
                featuresContainer.innerHTML = features.map(f => `
                    <div class="feature">
                        <i class="fas ${f.icon}"></i>
                        <h4>${f.title}</h4>
                        <p>${f.desc}</p>
                    </div>
                `).join('');
            }

            const compBtn = document.getElementById('compareBtn');
            if (compBtn) {
                compBtn.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const isActive = this.classList.contains('active');
                    if (typeof window.showToast === 'function') {
                        window.showToast(isActive ?
                            `${product.name} added to comparison.` :
                            `${product.name} removed from comparison.`
                        );
                    }
                });
            }

            const waBtn = document.getElementById('whatsappBtn');
            if (waBtn) {
                const waPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                waBtn.href =
                    `https://wa.me/254750210207?text=Hello%2C%20I%20would%20like%20to%20order%20${encodeURIComponent(product.name)}%20at%20KES%20${waPrice}%20per%20bag.%20Please%20confirm%20availability.`;
            }

            // --- Recently Viewed ---
            if (typeof window.saveRecentlyViewed === 'function') {
                window.saveRecentlyViewed(product.id);
            }

            setTimeout(function() {
                if (typeof window.renderRecentlyViewed === 'function') {
                    window.renderRecentlyViewed();
                }
            }, 100);

            renderRelatedProducts(product.id);
        }

        // ============================================
        // RENDER RELATED PRODUCTS
        // ============================================
        function renderRelatedProducts(currentProductId) {
            const container = document.getElementById('relatedProductsGrid');
            if (!container) return;

            if (typeof products === 'undefined') {
                container.innerHTML = '<p>Loading related products...</p>';
                return;
            }

            const currentProduct = products.find(p => p.id === currentProductId);
            let relatedIds = currentProduct?.related || [];

            if (relatedIds.length === 0) {
                const others = products.filter(p => p.id !== currentProductId);
                for (let i = others.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [others[i], others[j]] = [others[j], others[i]];
                }
                relatedIds = others.slice(0, 4).map(p => p.id);
            }

            const relatedProducts = relatedIds
                .map(id => products.find(p => p.id === id))
                .filter(p => p !== undefined);

            if (relatedProducts.length === 0) {
                container.innerHTML =
                    '<p style="text-align:center; color: var(--text-muted);">No related products found.</p>';
                return;
            }

            container.innerHTML = relatedProducts.map(product => {
                let stockClass = '';
                let stockText = product.stock || 'In Stock';
                if (stockText === 'In Stock') stockClass = 'in-stock';
                else if (stockText === 'Low Stock') stockClass = 'low-stock';
                else if (stockText === 'Out of Stock') stockClass = 'out-of-stock';
                else stockClass = 'in-stock';

                let badgeHtml = '';
                if (product.isBestSeller) badgeHtml = `<span class="product-badge bestseller">Best Seller</span>`;
                else if (product.isNew) badgeHtml = `<span class="product-badge new">New</span>`;
                else if (product.isFeatured) badgeHtml = `<span class="product-badge featured">Featured</span>`;

                let salePercent = '';
                if (product.oldPrice) {
                    const oldNum = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''));
                    const newNum = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                    if (!isNaN(oldNum) && !isNaN(newNum) && oldNum > newNum) {
                        const percent = Math.round((1 - newNum / oldNum) * 100);
                        salePercent = `<span class="sale-percent">-${percent}%</span>`;
                    }
                }

                let priceHtml = '';
                if (product.oldPrice) {
                    priceHtml = `
                        <span class="old-price">${product.oldPrice}</span>
                        <span class="sale-price">${product.price}</span>
                    `;
                } else {
                    priceHtml = `<span class="regular-price">${product.price}</span>`;
                }

                const waLink = `https://wa.me/254750210207?text=Hello%2C%20I%20would%20like%20to%20order%20${encodeURIComponent(product.name)}%20at%20KES%20${product.price.replace(/[^0-9.]/g,'')}`;

                return `
                    <div class="product-card" data-product-id="${product.id}">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" width="${getProductImageDimensions(product.image).width}" height="${getProductImageDimensions(product.image).height}" loading="lazy" decoding="async">
                            ${badgeHtml}
                            ${salePercent}
                            <span class="stock-badge ${stockClass}">${stockText}</span>
                        </div>
                        <div class="product-body">
                            <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
                            <p class="description">${product.description.substring(0, 80)}...</p>
                            <div class="price-row">${priceHtml}</div>
                        </div>
                        <div class="product-footer">
                            
                            <a href="product.html?id=${product.id}" class="btn-sm btn-outline">View Details</a>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ============================================
        // TAB FUNCTIONALITY
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            // Tab switching
            document.querySelectorAll('#tabNav button').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('#tabNav button').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const tab = this.dataset.tab;
                    document.querySelectorAll('#productTabs .tab-panel').forEach(p => p.classList.remove('active'));
                    const panel = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
                    if (panel) panel.classList.add('active');
                });
            });

            // Lightbox
            const mainImage = document.getElementById('mainImage');
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightboxImage');
            const closeLightbox = document.getElementById('closeLightbox');

            if (mainImage && lightbox) {
                mainImage.addEventListener('click', function() {
                    lightbox.classList.add('active');
                    const lightboxDimensions = getProductImageDimensions(this.src);
                    lightboxImage.src = this.src;
                    lightboxImage.alt = this.alt;
                    lightboxImage.width = lightboxDimensions.width;
                    lightboxImage.height = lightboxDimensions.height;
                    document.body.style.overflow = 'hidden';
                });

                lightbox.addEventListener('click', function(e) {
                    if (e.target === this) {
                        lightbox.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });

                if (closeLightbox) {
                    closeLightbox.addEventListener('click', function() {
                        lightbox.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                }

                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                        lightbox.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }

            // Mobile Menu
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
            }

            // Scroll to Top
            const scrollTopBtn = document.getElementById('scrollTop');
            if (scrollTopBtn) {
                window.addEventListener('scroll', function() {
                    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
                });
                scrollTopBtn.addEventListener('click', function() {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            // Render product page
            renderProductPage();

            });
    
