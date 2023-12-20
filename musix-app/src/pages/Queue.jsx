import { useContext, useEffect, useState } from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import '../styles/Queue.css'
import SongBoxLarge from "../components/SongBoxLarge";
import { addToFavorites } from "../helpers/Favorites";
import Context from "../context/Context";
import PlayerContext from "../context/PlayerContext";


const Queue = () => {
    const [songs, setSongs] = useState([])

    /** This is to store the favorite songs of the playlist and handle(enabled/disabled) their Favorite Icon */
    const [favorites, setFavorites] = useState([])

    //To display a floating message in the view
    const { setAlertVisible, setMsgAlert } = useContext(Context);

    const {QUEUE, setQUEUE} = useContext(PlayerContext)

    //I use this to store the parent element with the clase 'active-...', to display a 
    //line where the user can drop the song of the queue and to know where the user drop it 
    //and to know the position to put that song on the queue.
    const [guideSong, setGuideSong] = useState();

    //State to store the position where the user wants to move the song.
    const [moveToPosition, setMoveToPosition] = useState();

    useEffect(() => {
        let songs = []
        QUEUE.forEach((node, index) => {
            songs.push(node.data)
        })

        setSongs(songs)

    }, [QUEUE.idPosition])

    const addFavorite = (e) => {
        addToFavorites(e, favorites, setFavorites, setAlertVisible, setMsgAlert, null, null, null, null)
    }

    const handleDragStart = (e, idSong) => {
        e.stopPropagation();
        let { positionNode } = QUEUE.searchByIdSong(idSong)

        e.dataTransfer.setData("text/plain", positionNode)

    }

    const handleDragOver = (e) => {

        e.preventDefault();

        if (!e.target.matches('.songs *')) return;


        if (guideSong) {
            guideSong.classList.remove('active-top')//Remove the class active of that element
            guideSong.classList.remove('active-bottom')
        }

        //Inside this conditional I'm doing the logic to change the interface when the user moves
        //a song, so the goal is to display a line where the use can drop the song. 
        //Check if the guideSong has an element
        let parent = findParantWithClass(e.target, 'song-box')//Get the parent
        let parentHight = parent.getBoundingClientRect().height//Get the parent hight
        let currentPositionY = e.nativeEvent.layerY;//Get the current position of the user inside the parent element

        if (currentPositionY < parentHight / 2) {
            parent.classList.add('active-top')
        } else if (currentPositionY >= parentHight / 2) {
            parent.classList.add('active-bottom')
        }

        setMoveToPosition(QUEUE.searchByIdSong(parent.dataset.id).positionNode)

        setGuideSong(parent)//Store the parent with the class active-... added

    }

    const handleDragLeave = (e) => {
        e.preventDefault();

        if (guideSong) {
            guideSong.classList.remove('active-top')//Remove the class active of that element
            guideSong.classList.remove('active-bottom')
        }
    }

    const handleDrop = (e) => {
        e.preventDefault();

        const positionNode = parseInt(e.dataTransfer.getData("text/plain"));//Position of the song in the QUEUE

        let QUEUEclone = QUEUE.clone()


        //Whit the guideSong state I can know if the user drops the song above or below the guideSong
        if (guideSong.classList.contains('active-bottom')) {
            //Below the guideSong
            let moveNodeToPosition = moveToPosition + 1
            QUEUEclone.move_specified(positionNode, moveNodeToPosition)
        } else if (guideSong.classList.contains('active-top')) {
            //Above the guideSong
            let moveNodeToPosition = moveToPosition
            QUEUEclone.move_specified(positionNode, moveNodeToPosition)
        }

        setQUEUE(QUEUEclone)

        if (guideSong) {
            guideSong.classList.remove('active-top')//Remove the class active of that element
            guideSong.classList.remove('active-bottom')
        }

        if (e.target.matches('.songs *')) return;
        e.stopPropagation();
    }

    /**
     * With this function I can find the parent of any element
     * @param {*} element - The element where the search will begin.
     * @param {*} className - class name of the parent to find
     * @returns 
     */
    const findParantWithClass = (element, className) => {
        let elementTemp = element
        do {
            if (elementTemp.classList.contains(className)) {//Check if the elementTemp contains the className 
                return elementTemp;//If it is so, return the elementTemp because its the parent.
            } else {//If not, get the elementTemp's parent and set it to the elementTemp variable
                elementTemp = elementTemp.parentElement;
            }
        } while (true)
    }


    return (
        <DefaultLayout>
            <main className="main queue">

                <h1>Queue</h1>

                <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="songs">

                    {
                        songs.length != 0 &&
                        songs.map(el => {
                            return <SongBoxLarge
                                isInQueue={true}
                                data={{
                                    id: el._id,
                                    cover: el.cover,
                                    name: el.name,
                                    artist: el.artist,
                                    duration: el.duration,
                                    album: el.album,
                                    created: el.created,
                                    pathSong: el.url,
                                    favoriteSong: el.favorite
                                }}
                                _favorite={el.favorite}
                                addFavorite={addFavorite}
                                moveSong={handleDragStart}
                            />
                        })
                    }

                </div>

            </main>
        </DefaultLayout>
    )
}


export default Queue;