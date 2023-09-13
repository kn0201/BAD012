function addItem1(item: Cart) {
  //let product = req.query(/*sql*/ `
  //select product.id as product_id, product.name as product_name, product.brand_id as product_brand_id,
  //product.catagories_id as product_catagories_id,product.price as product_price, product.stock as product_stock,
  //discount.id as discount_id, discount.product_id as discount_product_id, discount.brand_id as discount_brand_id,
  //discount.catagories as discount_catagories_id, discount.quantity as discount_quantity, discount.amount as discount_amount
  //from product left join quantity_discount on product.id = quantity_discount.product_id where product.is_delete = false and quantity.is_delete = false`)
  uncounted_list.push(item); //product
  checkDiscount(item);
}

function addDiscount1(item: Cart, quantity: number) {
  const discount_item: ResultItem = {
    id: item.discount_id,
    name: item.discount_title,
    quantity,
    price: item.discount_amount,
  };
  discount_list.push(discount_item);
  console.log('Add discount');
}

function pushCartList1() {
  // Clear the cart list
  cart_list = [];

  // Add counted items to the cart
  counted_list.forEach((countedItem) => {
    const existingCartItem = cart_list.find(
      (cartItem) =>
        cartItem.id === countedItem.product_id &&
        cartItem.name === countedItem.product_name
    );
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      cart_list.push({
        id: countedItem.product_id,
        name: countedItem.product_name,
        quantity: 1,
        price: countedItem.product_price,
      });
    }
  });
  // Add uncounted items to the cart
  uncounted_list.forEach((uncountedItem) => {
    cart_list.push({
      id: uncountedItem.product_id,
      name: uncountedItem.product_name,
      quantity: 1,
      price: uncountedItem.product_price,
    });
  });

  // Add discounts to the cart
  discount_list.forEach((discountItem) => {
    cart_list.push(discountItem);
  });
}

function checkDiscount1(item: Cart) {
  if (!item.discount_id) {
    return;
  } else if (!item.discount_product_id) {
    if (
      (!item.discount_brand_id && !item.discount_catagories_id) ||
      (!item.discount_brand_id && item.discount_catagories_id) ||
      (!item.discount_catagories_id && item.discount_brand_id)
    ) {
      throw new Error('Discount do not exist');
    }
    const matchingItems = uncounted_list.filter(
      (obj) =>
        obj.product_brand_id === item.discount_brand_id &&
        obj.product_catagories_id === item.discount_catagories_id
    );

    uncounted_list.forEach((item) => {
      if (matchingItems.length % item.discount_quantity == 0) {
        for (let matchingItem of matchingItems) {
          counted_list.push(matchingItem);

          const index = uncounted_list.indexOf(matchingItem);

          uncounted_list.splice(index, 1);
          const countedItems = counted_list.filter(
            (countedItem) => countedItem.product_id === matchingItem.product_id
          );
          const quantityEligibleForDiscount = countedItems.length;

          if (quantityEligibleForDiscount % item.discount_quantity == 0) {
            addDiscount1(item, quantityEligibleForDiscount);
          }
        }
      }
    });
  }
  const matchingItems = uncounted_list.filter(
    (obj) => obj.product_id === item.discount_product_id
  );

  uncounted_list.forEach((item) => {
    if (matchingItems.length % item.discount_quantity == 0) {
      for (let matchingItem of matchingItems) {
        counted_list.push(matchingItem);

        const index = uncounted_list.indexOf(matchingItem);

        uncounted_list.splice(index, 1);
        const countedItems = counted_list.filter(
          (countedItem) => countedItem.product_id === matchingItem.product_id
        );
        const quantityEligibleForDiscount = countedItems.length;

        if (quantityEligibleForDiscount % item.discount_quantity == 0) {
          addDiscount1(item, quantityEligibleForDiscount);
        }
      }
    }
  });
  return { uncounted_list, counted_list };
}

const newItem3: Cart = {
  product_id: '2',
  product_name: '熱浪薯片',
  product_brand_id: '2',
  product_catagories_id: '2',
  product_price: 13.0,
  product_stock: 8,
  discount_id: '2',
  discount_title: 'Chip Buy 2 discount',
  discount_product_id: '2',
  discount_brand_id: '',
  discount_catagories_id: '',
  discount_quantity: 2,
  discount_amount: 2.0,
};

const newItem4: Cart = {
  product_id: '1',
  product_name: 'KitKat Chocolate Bar',
  product_brand_id: '1',
  product_catagories_id: '1',
  product_price: 6.0,
  product_stock: 6,
  discount_id: '1',
  discount_title: 'Bar Buy 2 discount',
  discount_product_id: '',
  discount_brand_id: '1',
  discount_catagories_id: '1',
  discount_quantity: 2,
  discount_amount: 2.0,
};
const newItem5: Cart = {
  product_id: '3',
  product_name: 'KitKat Pie',
  product_brand_id: '3',
  product_catagories_id: '3',
  product_price: 9.0,
  product_stock: 9,
  discount_id: '',
  discount_title: '',
  discount_product_id: '',
  discount_brand_id: '',
  discount_catagories_id: '',
  discount_quantity: +'',
  discount_amount: +'',
};
addItem1(newItem3); //Chip
addItem1(newItem4); //Bar
addItem1(newItem4); //Bar
addItem1(newItem3); //Chip
addItem1(newItem4); //Bar
addItem1(newItem5); //Pie //no
addItem1(newItem3); //Chip
addItem1(newItem4); //Bar
addItem1(newItem3); //Chip
addItem1(newItem4); //Bar//no
addItem1(newItem5); //Pie//no
pushCartList1(); //
console.log('Counted List:', counted_list);
console.log('Uncounted List:', uncounted_list);
console.log('Discount List:', discount_list);
console.log('Cart List:', cart_list);
