const getRecentPdp = () => {
    const storedData = localStorage.getItem('recently_viewed_mascotas');
    const pdpData = storedData ? JSON.parse(storedData) : '';
    const productCount = pdpData.length; 
    const inventoryOutStock = window.outStockText;       
    const inventoryInStock = window.inStockText;      
    const discountText = window.discountText;
    console.log("recently viewed product", pdpData);
    
    if (pdpData === '') {
        document.querySelector('.recently-viewed-products_container')?.remove();
        return;
    }
    const getInventoryMarkup = (inventoryQty) => {
        if (inventoryQty > 0) {
            const threshold = parseInt(document.querySelector('.recently-viewed-products_container').dataset.inventory);
            const color = inventoryQty <= threshold ? 'rgb(238,148,65)' : 'var(--color-success-green)';
            return `
                <p class="product__inventory" role="status" style="color: ${color};">
                    <svg width="12" height="12" aria-hidden="true">
                        <circle cx="6" cy="6" r="6" stroke="none" stroke-width="1" fill="currentColor"/>
                    </svg>
                    <span class="a stock-text">${inventoryInStock}</span>
                </p>
            `;
        } else {
            return `
                <p class="product__inventory" role="status" style="color: var(--color-attention-red);">
                    <svg width="12" height="12" aria-hidden="true">
                        <circle cx="6" cy="6" r="6" stroke="none" stroke-width="1" fill="currentColor"/>
                    </svg>
                    <span class="stock-text">${inventoryOutStock}</span>
                </p>
            `;
        }
    };         
    const getDiscount = (price, compareAtPrice) => {
        if (!price || !compareAtPrice) return '';
        
        const parsedPrice = parseInt(price.replace(/[^\d.-]/g, ""));
        const parsedCompareAtPrice = parseInt(compareAtPrice.replace(/[^\d.-]/g, ""));
        if (!parsedPrice || !parsedCompareAtPrice) return '';
        
        const discount = parseInt((parsedCompareAtPrice - parsedPrice) * 100 / parsedCompareAtPrice);
        
        return `
            <span class="discount__percentage">
                ${discount} + ${discountText}
            </span>
        `;
    };
    const visitedTitle = document.querySelector('.product .product-title').innerHTML;     
    const productListHTML = pdpData.map(item => {
        const inventoryMarkup = getInventoryMarkup(item.inventoryQty);
        const discountMarkup = getDiscount(item.productPrice, item.compareAtPrice);  
        if (item.productTitle !== visitedTitle) {
            return `
            <div class="swiper-slide recently-viewed-grid-item">
                <a href="${item.productUrl}" class="recently-grid__image"> 
                    <img class="recently-viewed-img" src='${item.productImg}' loading="lazy" alt="${item.productImageAltText}"/>
                </a>
                <h3 class="recently-viewed-title"><a class="recently-viewed-a" href="${item.productUrl}">${item.productTitle}</a></h3>                
            </div>
        `;            
        }          
    }).join('');        
    const productListContainer = document.querySelector('.recently-viewed-products');
    if (productListContainer) productListContainer.innerHTML = productListHTML;        
    const swiper1 = new Swiper('.swiper-recently', {
      slidesPerView: 4,
      slidesPerGroup: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        1024: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
      },
    });  
    const sliderPerView = swiper1.params.slidesPerView;
    if (productCount <= sliderPerView) {
        document.querySelectorAll('.recently-arrow__btn').forEach(item => {
        item.classList.add('hidden');
        })
    }
};
getRecentPdp();