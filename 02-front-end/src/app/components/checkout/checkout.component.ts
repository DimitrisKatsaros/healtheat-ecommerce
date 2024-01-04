import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { Province } from '../../common/province';
import { MyCustomValidators } from '../../validators/my-custom-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkOutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressProvinces: Province[] = [];
  billingAddressProvinces: Province[] = [];

  constructor(private formBuilder: FormBuilder,
    private formService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router // We inject the router so we can redirect later on in onSubmit()
  ) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace]),
        province: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace]),
        province: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), MyCustomValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        cvv: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''] // This 2 are pre-populated based on code logic
      })
    });

    // Populate credit card months ... Date().getMonth() is 0 based
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieving credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // Populate credit card years
    const startYear: number = new Date().getFullYear();
    console.log("startYear: " + startYear)
    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieving credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // Populate countries
    this.formService.getCountries().subscribe(
      data => {
        console.log("Retrieved Countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  reviewCartDetails() {

    // subscribe to cart cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cart cartService.totalQuantity
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkOutFormGroup.get('customer.lastName'); }
  get email() { return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressProvince() { return this.checkOutFormGroup.get('shippingAddress.province'); }
  get shippingAddressZipCode() { return this.checkOutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkOutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressProvince() { return this.checkOutFormGroup.get('billingAddress.province'); }
  get billingAddressZipCode() { return this.checkOutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkOutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditCardCVV() { return this.checkOutFormGroup.get('creditCard.cvv'); }

  onSubmit() {

    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    const order = new Order(this.totalQuantity, this.totalPrice);

    // get cart items
    const cartItems = this.cartService.cartItems;

    // populate purchase - customer
    const purchaseCustomer = this.checkOutFormGroup.controls['customer'].value;

    // create orderItems from cartItems
    const orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    // set up shippingAddress
    let shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState: Province = JSON.parse(JSON.stringify(shippingAddress.province));
    const shippingCountry: Country = JSON.parse(JSON.stringify(shippingAddress.country));
    shippingAddress.state = shippingState.name;
    shippingAddress.country = shippingCountry.name;

    // set up shippingAddress
    let billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState: Province = JSON.parse(JSON.stringify(billingAddress.province));
    const billingCountry: Country = JSON.parse(JSON.stringify(billingAddress.country));
    billingAddress.state = billingState.name;
    billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    const purchaseOrder = order;
    const purchaseOrderItems = orderItems;


    // set up purchase
    const purchase = new Purchase(
      purchaseCustomer, // populate purchase - customer
      shippingAddress, // populate purchase - shipping address
      billingAddress, // populate purchase - billing address
      purchaseOrder, // populate purchase - order
      purchaseOrderItems, // populate purchase - orderItems
    );
    console.log("Purchase: " + JSON.stringify(purchase))

    // call REST API via checkout Service
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

        this.resetCart();
      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    }
    );
  }

  resetCart() {
    // Reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0); // Send out 0 to all subscribers so they can reset
    this.cartService.totalQuantity.next(0);

    // Reset form data
    this.checkOutFormGroup.reset();

    // Navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  // This might cause a problem ... let's see
  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkOutFormGroup.controls['billingAddress']
        .setValue(this.checkOutFormGroup.controls['shippingAddress'].value);

      this.billingAddressProvinces = this.shippingAddressProvinces;
    } else {
      this.checkOutFormGroup.controls['billingAddress'].reset();

      this.billingAddressProvinces = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card month: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  // Populate provinces
  getProvinces(formGroupName: string) {

    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`Code: ${countryCode} Name: ${countryName}`);

    this.formService.getProvinces(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressProvinces = data;
        } else {
          this.billingAddressProvinces = data;
        }

        // Select first item as default
        formGroup?.get('province')?.setValue(data[0]);
      }
    );
  }
}
