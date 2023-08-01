from flask import Blueprint

from Controlador.controller_artist import insert_artist, get_artists, get_artist

from Controlador.controller_users import create_users, update_profile, upload_file, auth_user,find_user, find_account, add_song, get_songs, get_recent_songs, get_songsByArtist

from Controlador.controller_playlist import add_favorite, get_playlists, get_song_playlists, create_playlist, get_playlist, add_to_playlist, get_favorites, create_playlistFavorite

from Controlador.controller_songs import get_recommended_songs, get_my_likes, get_song, search_songs

from Controlador.controller_history import updateHistory, getHistory

blueprint = Blueprint('blueprint', __name__)


blueprint.route('/createaccount', methods=['POST'])(create_users)
blueprint.route('/uploadFile', methods=['POST'])(upload_file)
blueprint.route('/updateProfile', methods=['POST'])(update_profile)

blueprint.route('/auth', methods=['POST'])(auth_user)
blueprint.route('/finduser/<id>', methods=['GET'])(find_user)
blueprint.route('/findaccount/<id>', methods=['GET'])(find_account)

blueprint.route('/addsong', methods=['POST'])(add_song)
blueprint.route('/getsongs', methods=['GET'])(get_songs)
blueprint.route('/search/<search>', methods=['GET'])(search_songs)
blueprint.route('/getrecentsongs/<iduser>', methods=['GET'])(get_recent_songs)
blueprint.route('/createPlaylistFavorites/<iduser>/<date>', methods=['GET'])(create_playlistFavorite)
blueprint.route('/addfavorite/<idsong>/<iduser>/<date>', methods=['GET'])(add_favorite)
blueprint.route('/getplaylists/<iduser>', methods=['GET'])(get_playlists)
blueprint.route('/getplaylist/<idplaylist>', methods=['GET'])(get_playlist)

blueprint.route('/getsongplaylist/<idsong>', methods=['GET'])(get_song_playlists)
blueprint.route('/createplaylist', methods=['POST'])(create_playlist)
blueprint.route('/addtoplaylist/<idplaylist>/<idsong>', methods=['GET'])(add_to_playlist)
blueprint.route('/getfavorites/<iduser>', methods=['GET'])(get_favorites)

blueprint.route('/addartist', methods=['GET'])(insert_artist)
blueprint.route('/getartists', methods=['GET'])(get_artists)
blueprint.route('/getartist/<idartist>', methods=['GET'])(get_artist)
blueprint.route('/getsongbyartist/<artist>/<iduser>', methods=['GET'])(get_songsByArtist)

blueprint.route('/getrecommendedsongs/<iduser>', methods=['GET'])(get_recommended_songs)
blueprint.route('/getmylikes/<iduser>', methods=['GET'])(get_my_likes)
blueprint.route('/getsong/<idsong>/<iduser>', methods=['GET'])(get_song)

blueprint.route('/updateHistory', methods=['POST'])(updateHistory)
blueprint.route('/getHistory/<limit>/<iduser>', methods=['GET'])(getHistory)