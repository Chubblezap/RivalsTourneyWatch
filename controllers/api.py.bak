import tempfile
import json

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid
from gluon.tools import fetch

# Here go your api methods.

def get_tourneys():
    t = request.vars.t
    leagueJSON = json.loads(fetch("https://api.smash.gg/tournament/" + t + "?expand[]=tagsByContainer"))
    tDict = dict([('name', leagueJSON['entities']['tournament']['name'])])
    subleagueIDs = []
    sDicts = []
    leagueplayers = []
    # Get league standings
    leagueplayerJSON = json.loads(fetch("https://api.smash.gg/standing/" + t + "/getAllEvents?expand[]=participants&mutations[]=playerData&top=25"))
    for p in leagueplayerJSON['entities']['standing']:
        lplayerstanding = p['standing']
        lplayerID = p['entityId']
        for pl in leagueplayerJSON['entities']['player']:
            if (pl['id'] == lplayerID):
                leagueplayers.append(dict([('standing',lplayerstanding), ('tag', pl['gamerTag']), ('name', pl['name'])]))
    tDict['standings'] = leagueplayers
    # Get subleague IDs (NA, EU)
    for i in leagueJSON['entities']['entityContainerTag']:
        subleagueIDs.append(i['entityId'])

    # Switch to full event view
    subleaguesJSON = json.loads(fetch("https://api.smash.gg/tournament/" + t + "?expand[]=visibleEntityContainerTag"))
    for s in subleagueIDs:
        standings = []
        for i in subleaguesJSON['entities']['tournament']: # Get the subleague titles and slugs, used for getting events
            if (i['id'] == s):
                name = i['name']
                subslug = i['slug']
                playersJSON = json.loads(fetch("https://api.smash.gg/standing/tournament/"+str (s)+"/page?expand[]=participants&expand[]=standingPoints&mutations[]=playerData"))
                for p in playersJSON['items']['entities']['standing']:
                    pStand = p['standing']
                    pID = p['entityId']
                    for pl in playersJSON['items']['entities']['player']:
                        if (pl['id'] == pID):
                            pTag = pl['gamerTag']
                            pName = pl['name']
                    standings.append(dict([('standing', pStand), ('tag', pTag), ('name', pName)]))
                sDicts.append(dict([('name', name), ('standings', standings)]))
    tDict['subleagues'] = sDicts
    return response.json(dict(
        tDict=tDict
    ))

#def save():
#    d = request.vars.d
#    json.dump(d, open("tourn.json", 'w'))

#def load():
#    tDict = json.load(open("tourn.json")).as_dict()
#    return response.json(dict(
#        tDict=tDict
#    ))
