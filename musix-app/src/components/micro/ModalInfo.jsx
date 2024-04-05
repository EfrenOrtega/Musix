import '../../styles/modal-info.css'
const ModalInfo = ({setShowInfo, info, style}) => {

    console.log(info[0])

    return (

        <div className={`modal-info ${style}`} >
            <img onClick={() => setShowInfo(false)} className='close' src="./icons/icon_close.svg" alt="" />
            <div class="license-info">
                <p>Source : <a href="https://freemusicarchive.org/" target='_blank'>Free Music Archive</a></p>
                <p>Licencia: {info.length > 0 ? <a href={info[0].split('||')[0]} target='_blank'>{info[0].split('||')[1]}</a> : 'Pending'}</p>
            </div>
        </div>

    )

}


export default ModalInfo;