from flask import Blueprint

from Controlador.controller_users import create_users, upload_file, auth_user,find_user, add_song, get_songs, get_recent_songs

from Controlador.controller_playlist import add_favorite, get_playlists, get_song_playlists, create_playlist, get_playlist, add_to_playlist

blueprint = Blueprint('blueprint', __name__)


blueprint.route('/createaccount', methods=['POST'])(create_users)
blueprint.route('/uploadFile', methods=['POST'])(upload_file)

blueprint.route('/auth', methods=['POST'])(auth_user)
blueprint.route('/finduser/<id>', methods=['GET'])(find_user)
blueprint.route('/addsong', methods=['POST'])(add_song)
blueprint.route('/getsongs', methods=['GET'])(get_songs)
blueprint.route('/getrecentsongs', methods=['GET'])(get_recent_songs)
blueprint.route('/addfavorite/<idsong>/<iduser>/<date>', methods=['GET'])(add_favorite)
blueprint.route('/getplaylists/<iduser>', methods=['GET'])(get_playlists)
blueprint.route('/getplaylist/<idplaylist>', methods=['GET'])(get_playlist)

blueprint.route('/getsongplaylist/<idsong>', methods=['GET'])(get_song_playlists)
blueprint.route('/createplaylist', methods=['POST'])(create_playlist)
blueprint.route('/addtoplaylist/<idplaylist>/<idsong>', methods=['GET'])(add_to_playlist)