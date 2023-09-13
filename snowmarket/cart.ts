type Cart = {
  product_id: string;
  product_name: string;
  product_brand_id: string;
  product_catagories_id: string;
  product_price: number;
  product_stock: number;
  discount_id: any;
  discount_title: any;
  discount_product_id: any;
  discount_brand_id: any;
  discount_catagories_id: any;
  discount_quantity: any;
  discount_amount: any;
};

type ResultItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

let uncounted_list: Cart[] = [];
let counted_list: Cart[] = [];
let discount_list: ResultItem[] = [];
let cart_list: ResultItem[] = [];

function addItem(item: Cart) {
  //let product = req.query(/*sql*/ `
  //select product.id as product_id, product.name as product_name, product.brand_id as product_brand_id,
  //product.catagories_id as product_catagories_id,product.price as product_price, product.stock as product_stock,
  //discount.id as discount_id, discount.product_id as discount_product_id, discount.brand_id as discount_brand_id,
  //discount.catagories as discount_catagories_id, discount.quantity as discount_quantity, discount.amount as discount_amount
  //from product left join quantity_discount on product.id = quantity_discount.product_id where product.is_delete = false and quantity.is_delete = false`)
  uncounted_list.push(item); //product
  checkDiscount(item);
}

function addDiscount(countedItem: Cart) {
  const discount_item: ResultItem = {
    id: countedItem.discount_id,
    name: countedItem.discount_title,
    quantity: 1,
    price: countedItem.discount_amount,
  };
  discount_list.push(discount_item);
  console.log('Add discount');
}

function pushCartList(
  counted_list: Cart[],
  uncounted_list: Cart[],
  discount_list: ResultItem[]
) {
  cart_list = [];
  const cart_item: ResultItem = {
    id: '',
    name: '',
    quantity: 1,
    price: +'',
  };
  let mappedCountedList = counted_list.map((item) => {
    return {
      id: item.product_id,
      name: item.product_name,
      quantity: 1,
      price: item.product_price,
    };
  });
  let j = 0;
  for (let countedItem of mappedCountedList) {
    cart_list.push(countedItem);
    console.log('counted Push : ' + j);
    j++;
  }
  let mappedUncountedList = uncounted_list.map((item) => {
    return {
      id: item.product_id,
      name: item.product_name,
      quantity: 1,
      price: item.product_price,
    };
  });
  let i = 0;
  for (let uncountedItem of mappedUncountedList) {
    cart_list.push(uncountedItem);
    console.log('uncounted Push : ' + i);
    i++;
  }
  let k = 0;
  for (let discountItem of discount_list) {
    cart_list.push(discountItem);
    console.log('discount Push : ' + k);
    k++;
  }
}

function checkDiscount(item: Cart) {
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
          if (countedItems.length % item.discount_quantity == 0) {
            addDiscount(countedItems[countedItems.length - 1]);
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
        if (countedItems.length % item.discount_quantity == 0) {
          addDiscount(countedItems[countedItems.length - 1]);
        }
      }
    }
  });
  return { uncounted_list, counted_list };
}

const newItem: Cart = {
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

const newItem1: Cart = {
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
const newItem2: Cart = {
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
addItem(newItem); //Chip
addItem(newItem1); //Bar
addItem(newItem1); //Bar
addItem(newItem); //Chip
addItem(newItem1); //Bar
addItem(newItem2); //Pie //no
addItem(newItem); //Chip
addItem(newItem1); //Bar
addItem(newItem); //Chip
addItem(newItem1); //Bar//no
addItem(newItem2); //Pie//no
pushCartList(counted_list, uncounted_list, discount_list); //
console.log('Counted List:', counted_list);
console.log('Uncounted List:', uncounted_list);
console.log('Discount List:', discount_list);
console.log('Cart List:', cart_list);
