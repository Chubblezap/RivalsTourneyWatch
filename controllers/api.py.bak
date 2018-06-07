import tempfile

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid
from gluon.tools import fetch

# Here go your api methods.

def get_tourneys():
    t = request.vars.t
    page = fetch(t)
    return response.json(dict(
        page=page
    ))
