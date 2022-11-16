from flask import Blueprint

from Controlador.controller_users import create_users, upload_file, auth_user,find_user

blueprint = Blueprint('blueprint', __name__)


blueprint.route('/createaccount', methods=['POST'])(create_users)
blueprint.route('/uploadFile', methods=['POST'])(upload_file)

blueprint.route('/auth', methods=['POST'])(auth_user)
blueprint.route('/finduser/<id>', methods=['GET'])(find_user)
