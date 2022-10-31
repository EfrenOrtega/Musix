

export default function responsiveBoxes(CHILDREN) {

  const $CONTAINER = document.querySelector('.recently-added')

  let quantityArray = [];

  CHILDREN.forEach(child => {
    const $CHILDREN = document.querySelector(child)

    let wContainer = null
    let wChild = null
    let marginChild = null
    let quantity = null
    let style = window.getComputedStyle($CHILDREN)


    wContainer = $CONTAINER.getBoundingClientRect().width
    wChild = $CHILDREN.offsetWidth
    marginChild = parseFloat(style.marginLeft) + parseFloat(style.marginRight)

    quantity = Math.floor(wContainer / (wChild + marginChild))

    quantityArray.push(quantity);
  });

  return quantityArray;
}