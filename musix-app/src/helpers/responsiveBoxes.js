

export default function responsiveBoxes(CHILDREN) {

  let quantityArray = [];
  let $CONTAINER = null
  let $CHILDREN = null
  let wContainer = null
  let wChild = null
  let marginChild = null
  let quantity = null
  let style = null


  CHILDREN.forEach(child => {
    $CONTAINER = document.querySelector(child.split(' ')[0].toString())

    $CHILDREN = document.querySelector(child)
    style = window.getComputedStyle($CHILDREN)


    wContainer = $CONTAINER.getBoundingClientRect().width
    wChild = $CHILDREN.offsetWidth
    marginChild = parseFloat(style.marginLeft) + parseFloat(style.marginRight)

    quantity = Math.floor(wContainer / (wChild + marginChild))

    quantityArray.push(quantity);
  });

  return quantityArray;
}