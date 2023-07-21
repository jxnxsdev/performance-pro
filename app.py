from flask import Flask, make_response, request, render_template, jsonify
import sqlite3
import json
from datetime import datetime
import pandas as pd
from pathlib import Path, PureWindowsPath
import sys

app = Flask(__name__)

if sys.platform == 'win32':
    data_folder = PureWindowsPath(__file__).parents[0]
else:
    data_folder = Path(__file__).parents[0]



########################################################################################################################
############################################## Stücke
########################################################################################################################
@app.route("/")
@app.route("/t001_stueck") 
def t001_stueck():
    top = request.args.get('top') if 'top' in request.args else ''
    bottom = request.args.get('bottom') if 'bottom' in request.args else ''

    return render_template('t001_stuecke.html', top=top, bottom=bottom)

@app.route("/api/stuecke",methods = ['POST'])
def api_stuecke():
    return get_my_jsonified_data_DB1("select * ,(select 'aktiv' from T000_status t0 where t0.key = 'akt_stueck_id' and t0.value = t1.id) as aktiv from T001_stueck t1 order by id desc;")

@app.route("/api/stueckauswahl",methods = ['POST'])
def stueckauswahl():
    global aktuelles_Stueck
    aktuelles_Stueck = request.get_json()["id"]
    set_sql_data_DB1("REPLACE into T000_status (value, key) values( ? , 'akt_stueck_id');",[request.get_json()["id"]])
    return get_my_jsonified_data_DB1("select * ,(select 'aktiv' from T000_status t0 where t0.key = 'akt_stueck_id' and t0.value = t1.id) as aktiv from T001_stueck t1 order by id desc;")

@app.route("/api/stueck_save",methods = ['POST'])
def api_stueck_save():
    set_sql_data_DB1("update T001_stueck set beschreibung_1 = ?, beschreibung_2 = ?, jahr = ? where id = ?",   [request.get_json()["beschreibung_1"],request.get_json()["beschreibung_2"],request.get_json()["jahr"],request.get_json()["id"] ])
    return get_my_jsonified_data_DB1("select * ,(select 'aktiv' from T000_status t0 where t0.key = 'akt_stueck_id' and t0.value = t1.id) as aktiv from T001_stueck t1 order by id desc;")


@app.route("/api/stueckerzeugen",methods = ['POST'])
def api_stueckerzeugen():
    global aktuelles_Stueck

    set_sql_data_DB1("insert into T001_stueck (beschreibung_1, beschreibung_2, jahr) values( 'NEU' , 'NEU' , '" +datetime.now().strftime("%Y")+"' );",[])
    
    aktuelles_Stueck = json.loads(get_my_jsonified_data_DB1("select max(id) id from T001_stueck;"))[0]["id"]
    

    set_sql_data("CREATE TABLE T002_kanaele (id INTEGER PRIMARY KEY ,  midi_kanal int, maskierung int ,midi_befehl char(4), frequenz varchar(40),  beschreibung_1 varchar(300), beschreibung_2 varchar(300), gruppe int, aktiv int,microcheck int, muss_geprueft_werden int )",[])
#    set_sql_data("CREATE TABLE T003_besetzung (id INTEGER PRIMARY KEY   AUTOINCREMENT, kanal_nr int, beschreibung_1 varchar(300), beschreibung_2 varchar(300) , farbe char(6), gruppe int)",[])
    for i in range (1 , 129):
        set_sql_data("insert into T002_kanaele ( id , midi_kanal ,maskierung ,midi_befehl,frequenz,beschreibung_1,beschreibung_2, gruppe, aktiv,microcheck, muss_geprueft_werden) values (?,?,0,'84','','','',0,0,0,0) ",[i,i])
 #       set_sql_data("insert into T003_besetzung ( kanal_nr , beschreibung_1  ) values (?,'') ",[i])
    
    set_sql_data("CREATE TABLE T004_ablauf (id INTEGER PRIMARY KEY   AUTOINCREMENT, ablauf_id int, stichwort varchar(1000), aktion varchar(8000) )",[])



    return api_stuecke()


########################################################################################################################
############################################## Kanäle
########################################################################################################################
@app.route("/t002_kanaele") 
def t002_kanaele():
    top = request.args.get('top') if 'top' in request.args else ''
    bottom = request.args.get('bottom') if 'bottom' in request.args else ''

    return render_template('t002_kanaele.html', top=top, bottom=bottom, jsfile="t002_kanaele")

@app.route("/api/kanaele",methods = ['POST'])
def api_kanaele():
    return get_my_jsonified_data('select * from T002_kanaele order by id')

@app.route("/api/kanal_save",methods = ['POST'])
def api_kanal_save():
    set_sql_data("""update T002_kanaele set 
                  midi_kanal = ? 
                 , maskierung = ?
                 , midi_befehl = ?
                 , frequenz = ?
                 , beschreibung_1 = ?
                 , beschreibung_2 = ?
                 , gruppe = ?
                 , aktiv = ?
                 , muss_geprueft_werden = ?
                 , microcheck = ?
                 where id = ?"""
                 
                 ,[
                     request.get_json()["midi_kanal"]
                   , on_to_int(request.get_json()["maskierung"])
                   , request.get_json()["midi_befehl"]
                   , request.get_json()["frequenz"]
                   , request.get_json()["beschreibung_1"]
                   , request.get_json()["beschreibung_2"]
                   , request.get_json()["gruppe"]
                   , on_to_int(request.get_json()["aktiv"])
                   , request.get_json()["id"]
                   , on_to_int(request.get_json()["muss_geprueft_werden"])
                   , on_to_int(request.get_json()["microcheck"])
                   ])
    return get_my_jsonified_data('select * from T002_kanaele order by id')

def on_to_int(x):
    if str(x) == 'on' or str(x) == '1':
        return 1
    else:
        return 0
#######################################################################################################################
############################################## Ablauf
########################################################################################################################
@app.route("/t004_ablauf") 
def t004_ablauf():
    top = request.args.get('top') if 'top' in request.args else ''
    bottom = request.args.get('bottom') if 'bottom' in request.args else ''

    return render_template('t004_ablauf.html', top=top, bottom=bottom)

@app.route("/api/ablauf",methods = ['POST'])
def api_ablauf():
    return get_my_jsonified_data('select * from t004_ablauf order by ablauf_id')

@app.route("/api/ablauf_neu",methods = ['POST'])
def api_ablauf_neu():
    result = get_my_jsonified_data('select id, 0 as value from T002_kanaele order by id')
    set_sql_data("insert into t004_ablauf (ablauf_id, aktion, stichwort) values ((select ifnull(max(ablauf_id)+1,1) from t004_ablauf),?,'' )" ,[result] )
    return get_my_jsonified_data('select * from t004_ablauf order by ablauf_id')


@app.route("/api/ablauf_save",methods = ['POST'])
def api_ablauf_save():
    set_sql_data("update t004_ablauf set stichwort = ? where id = ?",
                 [request.get_json()["stichwort"],request.get_json()["id"]])
    return get_my_jsonified_data('select * from t004_ablauf order by ablauf_id')

@app.route("/api/ablauf_move",methods = ['POST'])
def api_ablauf_move():
    ablauf_id = json.loads(get_my_jsonified_data('select ablauf_id from t004_ablauf where id = ' + str(request.get_json()["id"]) ))[0]["ablauf_id"]
    print(ablauf_id)
    if request.get_json()["richtung"] == 1:
        set_sql_data("update t004_ablauf set ablauf_id = ablauf_id + 1 where id = ?",
                 [request.get_json()["id"] ])
        set_sql_data("update t004_ablauf set ablauf_id = ablauf_id - 1 where id != ? and ablauf_id = ?",
                 [request.get_json()["id"], ablauf_id +1])    
    else:
        set_sql_data("update t004_ablauf set ablauf_id = ablauf_id - 1 where id = ?",
                 [request.get_json()["id"] ])
        set_sql_data("update t004_ablauf set ablauf_id = ablauf_id + 1 where id != ? and ablauf_id = ?",
                 [request.get_json()["id"], ablauf_id -1])  
    return get_my_jsonified_data('select * from t004_ablauf order by ablauf_id')


@app.route("/api/ablauf_add",methods = ['POST'])
def api_ablauf_add():
    ablauf_id = json.loads(get_my_jsonified_data('select ablauf_id from t004_ablauf where id = ' + str(request.get_json()["id"]) ))[0]["ablauf_id"]
    print(ablauf_id)

    ## Verschieben nach unten
    set_sql_data("update t004_ablauf set ablauf_id = ablauf_id + 1 where ablauf_id > ?",
                [ablauf_id ])
    ## neu einfügen in Lücke
    result = get_my_jsonified_data('select id, 0 as value from T002_kanaele order by id')
    set_sql_data("insert into t004_ablauf (ablauf_id, aktion, stichwort) values (?,?,'' )" ,[ablauf_id + 1, result] )
    return get_my_jsonified_data('select * from t004_ablauf order by ablauf_id')



@app.route("/api/ablauf_toggle",methods = ['POST'])
def api_ablauf_toggle():
    aktion = json.loads(get_my_jsonified_data('select aktion from t004_ablauf where id = ' + str(request.get_json()["id"]) ))[0]["aktion"]
    aktion = json.loads(aktion)
    aktion_neu = []
    ret = 0
    val = 0
    for a in aktion:
        if a["id"] == request.get_json()["kanal_nr"]:
            ret += 1
            a["value"] = 1- a["value"] #request.get_json()["value"]
            val = a["value"]
        aktion_neu.append(a)
    set_sql_data("update t004_ablauf set aktion = ? where id = ?",
                  [json.dumps(aktion_neu),request.get_json()["id"]])
    ret += 1
    return {"return": ret, "value": val}#get_my_jsonified_data('select * from t004_ablauf order by id')


#######################################################################################################################
############################################## Produktion
########################################################################################################################
@app.route("/t005_produktion") 
def t005_produktion():
    top = request.args.get('top') if 'top' in request.args else ''
    bottom = request.args.get('bottom') if 'bottom' in request.args else ''

    return render_template('t005_produktion.html', top=top, bottom=bottom)


@app.route("/api/ablauf_akt_punkt",methods = ['POST'])
def ablauf_akt_punkt():
    return get_my_jsonified_data_DB1("select * from t000_status where key = 'akt_ablauf'")

@app.route("/api/ablauf_produktion",methods = ['POST'])
def api_ablauf_produktion():
    return get_my_jsonified_data('select * from t004_ablauf where ablauf_id >= '+request.get_json()["ablauf_id"]+' order by ablauf_id',)

@app.route("/api/ablauf_produktion_weiter",methods = ['POST'])
def api_ablauf_produktion_weiter():
    akt_ablauf = str(int(json.loads(get_my_jsonified_data_DB1("select * from t000_status where key = 'akt_ablauf'"))[0]["value"]) +1)
    set_sql_data_DB1("update t000_status set value = ? where key = 'akt_ablauf'",[akt_ablauf ])
    return get_my_jsonified_data('select * from t004_ablauf where ablauf_id >= '+ akt_ablauf  + ' order by ablauf_id LIMIT 4',)

@app.route("/api/ablauf_produktion_zurueck",methods = ['POST'])
def api_ablauf_produktion_zurueck():
    akt_ablauf = str(int(json.loads(get_my_jsonified_data_DB1("select * from t000_status where key = 'akt_ablauf'"))[0]["value"]) -1)
    set_sql_data_DB1("update t000_status set value = ? where key = 'akt_ablauf'",[akt_ablauf ])
    return get_my_jsonified_data('select * from t004_ablauf where ablauf_id >= '+ akt_ablauf + ' order by ablauf_id LIMIT 4',)




@app.route("/api/maskieren_toggle",methods = ['POST'])
def api_maskieren_toggle():
    maskierung = int(json.loads(get_my_jsonified_data("select maskierung from T002_kanaele where id = " + str(request.get_json()["id"]) ))[0]["maskierung"])
    maskierung = 1- maskierung

    set_sql_data('update T002_kanaele set maskierung = ? where id = ?',[ str(maskierung), str(request.get_json()["id"])])    
    
    return {"return": maskierung} 


#######################################################################################################################
############################################## Micro Check
########################################################################################################################
@app.route("/t006_microcheck") 
def t006_microcheck():
    top = request.args.get('top') if 'top' in request.args else ''
    bottom = request.args.get('bottom') if 'bottom' in request.args else ''

    return render_template('t006_microcheck.html', top=top, bottom=bottom)




#######################################################################################################################
def get_my_jsonified_data_DB1(sql):
    cnx = sqlite3.connect(data_folder / "db" / "db.db")
    data = pd.read_sql_query(sql, cnx).to_json(orient ='records')

    #print(data)
    return data

def get_my_jsonified_data(sql):
    t = str(aktuelles_Stueck)+".db"
    cnx = sqlite3.connect(data_folder  / "db" / t)
    data = pd.read_sql_query(sql, cnx).to_json(orient ='records')
    #print(data)
    return data

def set_sql_data_DB1(sql,para):
    con = sqlite3.connect(data_folder / "db" / "db.db")
    cur = con.cursor()
    #print(sql)
    cur.execute(sql,para)
    con.commit()
    return {}

def set_sql_data(sql,para):
    t = str(aktuelles_Stueck)+".db"
    con = sqlite3.connect(data_folder / "db" / t)
    cur = con.cursor()
    print(sql, str(para))
    cur.execute(sql,para)
    con.commit()
    return {}

        
@app.route("/create_db")
def db_create():
    set_sql_data_DB1("CREATE TABLE T001_stueck (id INTEGER PRIMARY KEY   AUTOINCREMENT, beschreibung_1 varchar(255), beschreibung_2 varchar(255), jahr char(4) )",[])
    set_sql_data_DB1("CREATE TABLE T000_status (key varchar(255) PRIMARY KEY , value varchar(255) )",[])

    return 'das hat funktioniert'

aktuelles_Stueck = json.loads(get_my_jsonified_data_DB1("select max(id) id from T001_stueck;"))[0]["id"]



if __name__ == '__main__':
    import os
    #flask --debug --app app run