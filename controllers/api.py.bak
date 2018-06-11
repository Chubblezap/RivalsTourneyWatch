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

@auth.requires_signature()
def save():
    if request.vars.dic is not None:
        d = json.loads(request.vars.dic)
        for le in d:
            db.league.update_or_insert(name=le['name']) # Insert all league names.
            for pl in le['standings']:
                db.player.update_or_insert((db.player.name==pl['name']) & (db.player.tag==pl['tag']) & (db.player.parent==le['name']),
                                           name=pl['name'], tag=pl['tag'], parent=le['name'], standing=pl['standing']) # Insert all league-bound players.
            for s in le['subleagues']:
                db.subleague.update_or_insert(name=s['name'], parent=le['name']) # Insert all subleague names, bound to parent league name.
                for p in s['standings']:
                    db.player.update_or_insert((db.player.name==p['name']) & (db.player.tag==p['tag']) & (db.player.parent==s['name']),
                                               name=p['name'], tag=p['tag'], parent=s['name'], standing=p['standing']) # Insert all subleague-bound players.
    else:
        return

def load():
    tArr = []
    plarray = []
    parray = []
    subarray = []
    leagues = db().select(db.league.ALL)
    subleagues = db().select(db.subleague.ALL)
    players = db().select(db.player.ALL)
    for le in leagues:
        leaguedict = dict([('name', le.name)])

        plarray = []
        for pl in players:
            if pl.parent == le.name:
                plarray.append(dict([('name', pl.name), ('tag', pl.tag), ('standing', pl.standing)]))
        leaguedict['standings'] = plarray

        subarray = []
        for s in subleagues:
            if s.parent == le.name:
                subdict = dict([('name', s.name)])
                parray = []
                for p in players:
                    if p.parent == s.name:
                        parray.append(dict([('name', p.name), ('tag', p.tag), ('standing', p.standing)]))
                subdict['standings'] = parray
                subarray.append(subdict)
        leaguedict['subleagues'] = subarray
        tArr.append(leaguedict)
    return response.json(dict(
        tArr=tArr
    ))
