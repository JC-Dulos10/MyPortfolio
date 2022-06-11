function ready() {
  var addToCartButtons = document.getElementsByClassName('addToCartButton');
  for(var i =0; i < addToCartButtons.length; i++){
    addToCartButtons[i].addEventListener('click', addToCartClicked); //addToCartClicked is a function name//adds event click 
  }

  var movieImages = document.getElementsByClassName('movie-image');
  for(var i =0; i < movieImages.length; i++){
    movieImages[i].addEventListener('click', showMovieDetails); //addToCartClicked is a function name//adds event click 
  }

  var selectAllMessage = document.getElementById('select-all');
  var removeAllCheckedButton = document.getElementById('remove-all-button');
  
  selectAllMessage.addEventListener('click', selectAll);
  removeAllCheckedButton.addEventListener('click', removeAllChecked);

}

function removeAllChecked(){
  var cartItems = document.getElementsByClassName('cart-item');
  var checkedCartItemHolder = [];
  var ctr = 0;

  for(var i=0; i < cartItems.length; ++i){
    if(cartItems[i].getElementsByClassName('movie-check-box')[0].checked){
      checkedCartItemHolder[ctr] = cartItems[i].getElementsByClassName('movie-check-box')[0].parentElement.parentElement.parentElement;
      ++ctr;
    }
  }

    console.log(checkedCartItemHolder.length);
  for(var i=0; i <checkedCartItemHolder.length; ++i){
    checkedCartItemHolder[i].remove();
  }

  updateCartTotalPrice();
}

function selectAll(event){
  
  var checkboxes = document.getElementsByClassName('movie-check-box');
  
  if(document.getElementById('select-all').checked)
    for(var i = 0; i<checkboxes.length; ++i)
      checkboxes[i].checked = true;
  else{
    for(var i = 0; i<checkboxes.length; ++i)
      checkboxes[i].checked = false;
  }

}

function showMovieDetails(event){
  var value = event.target;
  var imageParent = value.parentElement;

  var title = imageParent.getElementsByClassName('movie-title')[0];
  var desc = imageParent.getElementsByClassName('movie-desc')[0];

  document.getElementsByClassName('movie-title-modal')[0].innerHTML = title.innerHTML;
  document.getElementsByClassName('movie-description-modal')[0].innerHTML = desc.innerHTML;

}

function addToCartClicked(event){
  var button = event.target; //gives button the element
  var storeItem = button.parentElement;
  var title = storeItem.getElementsByClassName('movie-title')[0].innerHTML;
  var price = storeItem.getElementsByClassName('movie-price')[0].innerHTML;
  var imageSrc = storeItem.getElementsByClassName('movie-image')[0].src;

  addItemToCartItems(title,price,imageSrc);
}

function addItemToCartItems(title, price, imageSrc){
  var cartItems = document.getElementsByClassName("cart-items")[0];

  //check if the item is already existing in the cart items
  var cartItemTitles = cartItems.getElementsByClassName('movie-title');

  for(var i = 0; i < cartItemTitles.length; i++){
    if(cartItemTitles[i].innerHTML == title){
      alert("This item is already in the cart.");
      return; //break function.
    }
  }

  //Create new element -- row cart item
  var cartRow = document.createElement('div');  // like <div></div>
  cartRow.classList.add('cart-item');       //like <div class="cart-item"> </div>
  cartRow.classList.add('row');           //like <div class="cart-item row"> </div>

  var cartRowContents = 
    ` <div class = "col"> 
        <div style="display:inline-block">  
          <input type="checkbox" name="" class = "movie-check-box"> 
          <img src="${imageSrc}" class="movie-image" style="margin: 15px;"> 
        </div>  
        <br>
        <span class="movie-title">${title}</span>
        <br>
      </div>

      <div class = "col" style="margin: 5px;">  
        <br>
        <span class="cart-movie-price" style="display:none;">${price}</span> 
        <span class="movie-price-base"> ${price}</span>
      </div>

      <div class = "col cart-item-details" style="margin: 20px;"> 
        <input type="number" name="" class="cart-item-quantity-input" value="1"> 
        <br><br>
        <button class="btn-danger">REMOVE</button>
        <br>
      </div>
    `

    cartRow.innerHTML = cartRowContents;

    //add event of buttons in CartRow
    cartRow.getElementsByClassName('cart-item-quantity-input')[0].addEventListener('change', quantityChanged);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);

    cartItems.append(cartRow);

    updateCartTotalPrice();
}

function removeCartItem(event){
  var button = event.target;
  button.parentElement.parentElement.remove();
  updateCartTotalPrice();
}

function updateCartTotalPrice(){
  // Get the parent of cart item == cartitems
  var cartItems = document.getElementsByClassName('cart-items')[0];
  var cartItemList = cartItems.getElementsByClassName('cart-item');
  
  var total = 0;

  for(var i = 0; i < cartItemList.length; i++){
    var priceElement = cartItemList[i].getElementsByClassName('cart-movie-price')[0];
    var price; 
    price = parseFloat(priceElement.innerHTML.replace('Php ', ''));
    total += price;
  }

  var totalPrice = document.getElementsByClassName('cart-total-price')[0];
  totalPrice.innerHTML = total;
}

function quantityChanged(event){
  var input = event.target;
  var cartItem = input.parentElement.parentElement;
  var basePrice = cartItem.getElementsByClassName('movie-price-base')[0];
  basePrice = basePrice.innerHTML.replace('Php ','');
  basePrice = parseFloat(basePrice);

  var value = basePrice * input.value;

  cartItem.getElementsByClassName('cart-movie-price')[0].innerHTML = 'Php ' + value;

  updateCartTotalPrice();
}

function SubmitFunction() {
      alert('Submitted!!!');
      document.getElementById('formTest').submit();
}

function PurchaseFunction() {
  //get the parent that holds the cart items
  var cartItems = document.getElementsByClassName("cart-items")[0];

  //get all the cart item inside the parent
  var cartItemList = cartItems.getElementsByClassName("cart-item");
  var movieList = [];

  for (var i = 0; i < cartItemList.length; i++) {
   var title = cartItemList[i].getElementsByClassName("movie-title")[0].innerHTML;
   var price = cartItemList[i].getElementsByClassName("cart-movie-price")[0].innerHTML;
   var image = cartItemList[i].getElementsByClassName("movie-image")[0].src;

   movieList[i] = {titleValue: title, priceValue: price, imageSrc: image};
  }
  console.log(movieList);

  sessionStorage.setItem("movieList", JSON.stringify(movieList));

  window.location.href="orderForm.html";
}

function onLoadItemRedirectPage() {
  var movieList = JSON.parse(sessionStorage.getItem("movieList"));

  var itemPurchased = document.getElementsByClassName("item-purchased")[0];

  for (var i = 0; i < movieList.length; i++) {
    var title = movieList[i].titleValue;
    var price = movieList[i].priceValue;
    var image = movieList[i].imageSrc;
    var cartRow = document.createElement('div');  // like <div></div>
    cartRow.classList.add('cart-item-purchased');       //like <div class="cart-item"> </div>
    cartRow.classList.add('row');           //like <div class="cart-item row"> </div>
    var cartRowContents = 
    ` <div class = "card-custom"> 
        <div style="display:block">  
          <img src="${image}" class="movie-image"> 
          <br>  
          <span class="movie-title">${title}</span>
          <br>
          <span class="cart-movie-price">${price}</span> 
        </div>
      </div>`
      cartRow.innerHTML = cartRowContents;
      itemPurchased.append(cartRow);
  }
}

function resetStorage() {
  sessionStorage.clear();
}

function SubmitForm() {

  if(document.getElementById('username').value != "dulos") {
    alert('wrong!!!');
    document.getElementById('submitForm').reset();
    window.location.replace("home.html");
  } 
  else if(document.getElementById('username').value == "dulos") {
    alert('correct!!!');
    document.getElementById('submitForm').submit();
  } 
}  
  