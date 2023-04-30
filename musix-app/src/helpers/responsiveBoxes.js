

export default function responsiveBoxes(CONTAINERS) {

  let quantityArray = [];
  let $CONTAINER = null
  let wContainer = null
  let wChild = null
  
  let children = {
    0:{width:128, margin:16, parent:'recentlyAdded'},
    1:{width:160, margin:16, parent:'yourLikes'},
    2:{width:128, margin:20, parent:'playlist'},
  }
  
  let marginChild = null

  try {
    Object.values(children).map((child, index)=>{

      $CONTAINER = CONTAINERS.current[child.parent];
      wContainer = $CONTAINER.getBoundingClientRect().width
      wChild = child.width
      marginChild = child.margin

      quantityArray.push(Math.floor(wContainer / (wChild + marginChild)))
    })

  } catch (error) {
    console.error("Error in resposiveBoxes.js", error)
  }

  return quantityArray;
}