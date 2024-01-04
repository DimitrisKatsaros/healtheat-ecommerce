import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // New properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  // Integrating our Service with our Angular component
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // If we have a different keyword than previous
    // then set pageNumber to 1
    if(this.previousKeyword != keyword){
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;
    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`)

    // Search products paginate
    this.productService.searchProductsPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               keyword).subscribe(this.processResult());

    // Search for products using that keyword
    // this.productService.searchProducts(keyword).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // );
  }

  handleListProducts() {

    // Check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // Get the "id" param string. convert string to a number using the "+" symbol. 
      // The "!" is the non-null assertion operator. Tells the compiler that the object is not null.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // Category not available ... default to category id 1
      this.currentCategoryId = 1;
    }

    //
    // Check if we have a different category id than previous
    // Note: Angular wil reuse a component if it's being viewed
    //

    // if we have a different category id the previous
    // then set pageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`)

    this.productService.getProductListPaginate(this.pageNumber - 1, // Pagination in Angular are 1 based and in Spring Data REST are 0 based.
                                               this.pageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());

    // now get the products for the given category id
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )
  }

  updatePageSize(pageSize: string){

    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product){

    console.log(`Adding to cart: ${product.name} | ${product.unitPrice}`);

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }
}
