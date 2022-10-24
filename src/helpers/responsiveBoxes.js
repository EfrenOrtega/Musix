
export default function responsiveBoxes() {
  const $CONTAINER = document.querySelector('.recently-added')
  const $MUSICBOX = document.querySelector('.recently-added .music-box')

  let wContainer = null
  let wMusicBox = null
  let quantity = null
  let marginMusicBox = null

  let style = window.getComputedStyle($MUSICBOX)


  wContainer = $CONTAINER.getBoundingClientRect().width
  wMusicBox = $MUSICBOX.offsetWidth
  marginMusicBox = parseFloat(style.marginLeft) + parseFloat(style.marginRight)

  quantity = Math.floor(wContainer / (wMusicBox + marginMusicBox))

  return quantity
}