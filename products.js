const products = [
    {
        id: 1,
        name: 'Bamburi Fundi',
        description: 'General purpose cement for residential construction. Ideal for foundations, slabs, plastering, rendering, and brick/block laying. Perfect for homeowners, fundis, and small contractors.',
        price: 'KSh 580',
        oldPrice: 'KSh 610',
        image: 'images/fundi.jpg',
        extraImages: ['images/fundi-2.jpg', 'images/fundi-3.jpg'],
        link: 'fundi.html',
        stock: 'In Stock',
        isBestSeller: true,
        isNew: false,
        isFeatured: true,
        // Product Details for product.html
        strength: '22.5 MPa',
        category: 'General Purpose Cement',
        packaging: '50kg bag',
        coverage: 'Approx. 8-10m² per bag (plastering)',
        recommendedUses: 'Mortar works, plastering, rendering, brick/block laying, general repairs',
        shelfLife: '6 months (unopened)',
        // Related Products (IDs)
        related: [2, 4, 7],  // Tembo, PowerMax, Powercrete
    },
    {
        id: 2,
        name: 'Bamburi Tembo',
        description: 'High-strength all-purpose cement for commercial buildings and infrastructure projects. Suitable for foundations, slabs, plastering, block laying, and general construction.',
        price: 'KSh 620',
        oldPrice: 'KSh 650',
        image: 'images/tembo.jpg',
        extraImages: ['images/tembo-2.jpg'],
        link: 'tembo.html',
        stock: 'In Stock',
        isBestSeller: false,
        isNew: false,
        isFeatured: true,
        // Product Details
        strength: '32.5 MPa',
        category: 'All-Purpose Cement',
        packaging: '50kg bag',
        coverage: 'Approx. 10-12m² per bag',
        recommendedUses: 'Foundations, slabs, plastering, block laying, general construction',
        shelfLife: '6 months (unopened)',
        // Related Products
        related: [1, 3, 6],  // Fundi, Nguvu, PowerPlus
    },
    {
        id: 3,
        name: 'Bamburi Nguvu',
        description: 'Extra-strength cement for heavy-duty construction and load-bearing structures. Rapid setting with medium-strength concrete ideal for structural fills and industrial applications.',
        price: 'KSh 680',
        oldPrice: 'KSh 720',
        image: 'images/nguvu.jpg',
        extraImages: [],
        link: 'nguvu.html',
        stock: 'In Stock',
        isBestSeller: false,
        isNew: false,
        isFeatured: true,
        // Product Details
        strength: '32.5 MPa',
        category: 'High-Strength Cement',
        packaging: '50kg bag',
        coverage: 'Approx. 10-12m² per bag',
        recommendedUses: 'Structural fills, industrial applications, heavy-duty concrete',
        shelfLife: '6 months (unopened)',
        // Related Products
        related: [2, 4, 6],  // Tembo, PowerMax, PowerPlus
    },
    {
        id: 4,
        name: 'Bamburi PowerMax',
        description: 'High-performance cement for advanced construction and engineering projects. High early strength with low heat of hydration – ideal for mass concrete, foundations, beams, and columns.',
        price: 'KSh 750',
        oldPrice: 'KSh 780',
        image: 'images/powermax.jpg',
        extraImages: ['images/powermax-2.jpg', 'images/powermax-3.jpg'],
        link: 'powermax.html',
        stock: 'In Stock',
        isBestSeller: false,
        isNew: true,
        isFeatured: true,
        // Product Details
        strength: '42.5 MPa',
        category: 'Premium Cement',
        packaging: '50kg bag',
        coverage: 'Approx. 12-15m² per bag',
        recommendedUses: 'Mass concrete, foundations, beams, columns, high-rise buildings',
        shelfLife: '6 months (unopened)',
        // Related Products
        related: [1, 5, 6],  // Fundi, Duracem, PowerPlus
    },
    {
        id: 5,
        name: 'Bamburi Duracem',
        description: 'Premium sulphate-resistant cement for durable concrete in aggressive environments. Superior sulphate resistance – ideal for water-retaining structures and coastal construction.',
        price: 'KSh 820',
        oldPrice: 'KSh 860',
        image: 'images/duracem.jpg',
        extraImages: [],
        link: 'duracem.html',
        stock: 'In Stock',
        isBestSeller: false,
        isNew: false,
        isFeatured: true,
        // Product Details
        strength: '42.5 MPa',
        category: 'Sulphate Resistant Cement',
        packaging: '50kg bag',
        coverage: 'Approx. 12-15m² per bag',
        recommendedUses: 'Water-retaining structures, coastal construction, aggressive environments',
        shelfLife: '6 months (unopened)',
        // Related Products
        related: [4, 6, 7],  // PowerMax, PowerPlus, Powercrete
    },
    {
        id: 6,
        name: 'Bamburi PowerPlus',
        description: 'Ultra-high-strength OPC for specialized industrial applications. Perfect for structures over 4 floors, heavy-duty foundations, industrial slabs, and high-load areas.',
        price: 'KSh 950',
        oldPrice: 'KSh 990',
        image: 'images/powerplus.jpg',
        extraImages: ['images/powerplus-2.jpg'],
        link: 'powerplus.html',
        stock: 'In Stock',
        isBestSeller: false,
        isNew: true,
        isFeatured: true,
        // Product Details
        strength: '42.5 MPa',
        category: 'Ultra-High Strength Cement',
        packaging: '50kg bag',
        coverage: 'Approx. 12-15m² per bag',
        recommendedUses: 'High-rise buildings, heavy-duty foundations, industrial slabs, high-load areas',
        shelfLife: '6 months (unopened)',
        // Related Products
        related: [3, 4, 5],  // Nguvu, PowerMax, Duracem
    },
    {
        id: 7,
        name: 'Bamburi Powercrete',
        description: 'Ultra-high strength, fast-setting cement for prestressed and post-tensioned concrete. Ideal for high-rise structures, bridges, and advanced engineering projects.',
        price: 'KSh 1,050',
        oldPrice: 'KSh 1,080',
        image: 'images/powercrete.jpg',
        extraImages: [],
        link: 'powercrete.html',
        stock: 'In Stock',
        isBestSeller: false,
        isNew: false,
        isFeatured: true,
        // Product Details
        strength: '52.5 MPa',
        category: 'Ultra-High Strength Cement',
        packaging: '50kg bag',
        coverage: 'Approx. 15-18m² per bag',
        recommendedUses: 'Prestressed concrete, post-tensioned concrete, high-rise structures, bridges',
        shelfLife: '6 months (unopened)',
        // Related Products
        related: [4, 5, 6],  // PowerMax, Duracem, PowerPlus
    }
];

// ============================================
// RENDER FUNCTION – Product Grid
// ============================================
function renderProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    container.innerHTML = products.map(product => {
        // Stock badge
        let stockClass = '';
        let stockText = product.stock || 'In Stock';
        if (stockText === 'In Stock') stockClass = 'in-stock';
        else if (stockText === 'Low Stock') stockClass = 'low-stock';
        else if (stockText === 'Out of Stock') stockClass = 'out-of-stock';
        else stockClass = 'in-stock';

        // Product badges (Best Seller, New, Featured)
        let badgeHtml = '';
        if (product.isBestSeller) {
            badgeHtml = `<span class="product-badge bestseller">★ Best Seller</span>`;
        } else if (product.isNew) {
            badgeHtml = `<span class="product-badge new">✦ New</span>`;
        } else if (product.isFeatured) {
            badgeHtml = `<span class="product-badge featured">⭐ Featured</span>`;
        }

        // Sale badge & percentage
        let saleBadgeHtml = '';
        let salePercentHtml = '';
        if (product.oldPrice) {
            const oldNum = parseFloat(product.oldPrice.replace(/[^0-9.]/g, ''));
            const newNum = parseFloat(product.price.replace(/[^0-9.]/g, ''));
            if (!isNaN(oldNum) && !isNaN(newNum) && oldNum > newNum) {
                const percent = Math.round((1 - newNum / oldNum) * 100);
                saleBadgeHtml = `<span class="product-badge sale">🔥 Sale</span>`;
                salePercentHtml = `<span class="sale-percent">-${percent}%</span>`;
            }
        }

        // Price display
        let priceHtml = '';
        if (product.oldPrice) {
            priceHtml = `
                <span class="old-price">${product.oldPrice}</span>
                <span class="regular-price">${product.price}</span>
            `;
        } else {
            priceHtml = `<span class="regular-price">${product.price}</span>`;
        }

        // Extra images for hover gallery
        let galleryHtml = '';
        if (product.extraImages && product.extraImages.length > 0) {
            galleryHtml = `
                <div class="product-gallery">
                    ${product.extraImages.map(img => `
                        <img src="${img}" alt="${product.name}" loading="lazy">
                    `).join('')}
                </div>
            `;
        }

        // WhatsApp link
        const waLink = `https://wa.me/254750210207?text=Hello%2C%20I%20would%20like%20to%20order%20${encodeURIComponent(product.name)}%20at%20KES%20${product.price.replace(/[^0-9.]/g,'')}`;

        return `
            <div class="product-card" data-product-id="${product.id}" data-product-link="${product.link}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="main-image" loading="lazy">
                    ${galleryHtml}
                    ${badgeHtml}
                    ${saleBadgeHtml}
                    ${salePercentHtml}
                    <button class="wishlist-btn" data-product-id="${product.id}" aria-label="Add to wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                    <span class="stock-badge ${stockClass}">${stockText}</span>
                </div>

                <div class="product-body">
                    <h3><a href="${product.link}">${product.name}</a></h3>
                    <p class="description">${product.description.substring(0, 100)}...</p>
                    <div class="price-row">${priceHtml}</div>
                </div>

                <div class="product-footer">
                    <button class="btn-sm btn-add-quote" onclick="addToCart('${product.name}', ${parseFloat(product.price.replace(/[^0-9.]/g,''))}, '${waLink}')">
                        <i class="fas fa-plus"></i> Add to Quote
                    </button>
                    <a href="${product.link}" class="btn-sm btn-outline view-details">View Details</a>
                </div>
            </div>
        `;
    }).join('');

    attachProductEvents();
}

// ============================================
// ATTACH EVENT LISTENERS
// ============================================
function attachProductEvents() {
    // Wishlist toggle (with localStorage sync)
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.productId);

        // Set initial state from localStorage
        if (window.isInWishlist && window.isInWishlist(productId)) {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        }

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.productId);
            if (typeof window.toggleWishlist === 'function') {
                window.toggleWishlist(id);
                const isActive = window.isInWishlist(id);
                this.classList.toggle('active', isActive);
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('far', !isActive);
                    icon.classList.toggle('fas', isActive);
                }
                if (typeof window.updateWishlistBadge === 'function') {
                    window.updateWishlistBadge();
                }
                if (typeof window.showToast === 'function') {
                    window.showToast(isActive ? '❤️ Added to wishlist' : '💔 Removed from wishlist');
                }
            }
        });
    });

    // Track product views when clicking "View Details" or product name
    document.querySelectorAll('.product-card .view-details, .product-card h3 a').forEach(link => {
        link.addEventListener('click', function(e) {
            const card = this.closest('.product-card');
            const productId = card.dataset.productId;
            if (productId && typeof window.saveRecentlyViewed === 'function') {
                window.saveRecentlyViewed(productId);
            }
        });
    });
}

// ============================================
// GET PRODUCT BY ID (for product.html)
// ============================================
function getProductById(id) {
    return products.find(p => p.id === id) || null;
}

// ============================================
// GET RELATED PRODUCTS (for product.html)
// ============================================
function getRelatedProducts(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];
    
    // If product has defined related IDs
    if (product.related && product.related.length > 0) {
        const related = product.related
            .map(id => getProductById(id))
            .filter(p => p !== null);
        return related.slice(0, limit);
    }
    
    // Fallback: random products excluding current
    const others = products.filter(p => p.id !== productId);
    for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
    }
    return others.slice(0, limit);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
});