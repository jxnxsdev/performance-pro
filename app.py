from flask import Flask, make_response, request, render_template, jsonify
import sqlite3
import json
from datetime import datetime
import pandas as pd
from pathlib import Path, PureWindowsPath
import sys
#import rtmidi
app = Flask(__name__)

if sys.platform == 'win32':
    data_folder = PureWindowsPath(__file__).parents[0]
else:
    data_folder = Path(__file__).parents[0]

g_jinja = {}
########################################################################################################################
############################################## Initialisierung der DB1
########################################################################################################################
@app.route("/create_db",methods = ['GET'])
def new_db0():
    if local(request):
        return local(request)    
    import shutil
    import os

    jetzt = datetime.now()
    newpath = jetzt.strftime("%Y%m%d_%H%M%S")
    os.mkdir(data_folder / "db" / newpath)
    

    
    file_source = data_folder / "db"
    file_destination = data_folder / "db" / newpath 
    
    get_files = os.listdir(file_source)
    
    for g in get_files:
        if '.db' in g:
            shutil.move(file_source / g, file_destination)
    
    set_sql_data_DB1("""CREATE TABLE T000_status 
                    (key varchar(255) PRIMARY KEY 
                    , value varchar(255) )
                    """,[])

    set_sql_data_DB1("""insert into T000_status (key, value) values ('akt_ablauf', '1')
                    """,[])

    set_sql_data_DB1("""CREATE TABLE T001_stueck 
                    (id INTEGER PRIMARY KEY   AUTOINCREMENT
                    , beschreibung_1 varchar(255)
                    , beschreibung_2 varchar(255)
                    , jahr char(4) )
                    """,[])

    set_sql_data_DB1("""CREATE TABLE T002_kanaele 
                    (id INTEGER PRIMARY KEY 
                    , midi_kanal int
                    , maskierung int 
                    , midi_befehl char(4)
                    , frequenz varchar(40)
                    , beschreibung_1 varchar(300)
                    , beschreibung_2 varchar(300)
                    , gruppe int
                    , aktiv int
                    , microcheck int
                    , muss_geprueft_werden int 
                    )""",[])
    for i in range (1 , 129):
        set_sql_data_DB1("insert into T002_kanaele ( id , midi_kanal ,maskierung ,midi_befehl,frequenz,beschreibung_1,beschreibung_2, gruppe, aktiv,microcheck, muss_geprueft_werden) values (?,?,0,'176','','','',0,0,0,0) ",[i,i+63])

    global aktuelles_Stueck
    aktuelles_Stueck = 1
    global aktuelles_Stueck_txt
    aktuelles_Stueck_txt = ''
    return {"aktuelles_Stueck":"1"}

########################################################################################################################
############################################## Einstellungen
########################################################################################################################
@app.route("/t008_einstellungen")
def t008_einstellungen():
    if local(request):
        return local(request)
    global aktuelles_Stueck_txt
    
    return render_template('t008_einstellungen.html', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)

########################################################################################################################
############################################## Midi Ports auswählen
########################################################################################################################



@app.route("/midi_port") 
def midi_port():
    if local(request):
        return local(request)    
    global aktuelles_Stueck_txt

    return render_template('t007_midi_ports.html', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)

@app.route("/api/midi_ports",methods = ['POST'])
def api_midi_port():
    import rtmidi
    try:
        port_id = int(json.loads(get_my_jsonified_data_DB1("select value from T000_status where key = 'port_id';") )[0]["value"])
        
    except:
        port_id = None

    #print(rtmidi.get_api_name(rtmidi.API_UNIX_JACK))
    midiout = rtmidi.MidiOut(rtapi=rtmidi.API_UNSPECIFIED)
    liste = midiout.get_ports()
    res = []
    id = 0
    for l in liste:
        a = {}
        a["id"]  = id
        a["port"] = l
        a["aktiv"] = 0
        if port_id == id:
            a["aktiv"] = 1
        id += 1
        res.append(a)
    return json.dumps(res)


@app.route("/api/midi_ports_select",methods = ['POST'])
def midi_ports_select():
    set_sql_data_DB1("REPLACE into T000_status (value, key) values( ? , 'port_name');",[request.get_json()["port"]])
    set_sql_data_DB1("REPLACE into T000_status (value, key) values( ? , 'port_id');",[request.get_json()["id"]])
    
    Midi_Verbindung_oeffnen(int(request.get_json()["id"]))
    return api_midi_port()
    
    
########################################################################################################################
############################################## Aufruf von Localhost
########################################################################################################################


def local(request):
    global g_jinja
    if request.remote_addr == '127.0.0.1':
        g_jinja["local"] = 1
        return False
    else:
        g_jinja["local"] = 0
        return t006_microcheck()

########################################################################################################################
############################################## Stücke
########################################################################################################################
@app.route("/") 
def impressum():
    global aktuelles_Stueck_txt
    if local(request):
        return local(request)
        

    return render_template('impressum.html', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)

@app.route("/t001_stueck") 
def t001_stueck():
    if local(request):
        return local(request)
    global aktuelles_Stueck_txt

    return render_template('t001_stuecke.html', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)

@app.route("/api/stuecke",methods = ['POST'])
def api_stuecke():
    return get_my_jsonified_data_DB1("select * ,(select 'aktiv' from T000_status t0 where t0.key = 'akt_stueck_id' and t0.value = t1.id) as aktiv from T001_stueck t1 order by id desc;")

@app.route("/api/stueckauswahl",methods = ['POST'])
def stueckauswahl():
    global aktuelles_Stueck, aktuelles_Stueck_txt
    aktuelles_Stueck = request.get_json()["id"]
    aktuelles_Stueck_txt = json.loads(get_my_jsonified_data_DB1("select beschreibung_1 id from T001_stueck where id = "+str(aktuelles_Stueck)+";") )[0]["id"]
    set_sql_data_DB1("REPLACE into T000_status (value, key) values( ? , 'akt_stueck_id');",[request.get_json()["id"]])
    set_sql_data_DB1("REPLACE into T000_status (value, key) values( 1 , 'akt_ablauf');",[])
    
    return get_my_jsonified_data_DB1("select * ,(select 'aktiv' from T000_status t0 where t0.key = 'akt_stueck_id' and t0.value = t1.id) as aktiv from T001_stueck t1 order by id desc;")

@app.route("/api/stueck_save",methods = ['POST'])
def api_stueck_save():

    global aktuelles_Stueck_txt
    aktuelles_Stueck_txt = request.get_json()["beschreibung_1"]
    set_sql_data_DB1("update T001_stueck set beschreibung_1 = ?, beschreibung_2 = ?, jahr = ? where id = ?",   [request.get_json()["beschreibung_1"],request.get_json()["beschreibung_2"],request.get_json()["jahr"],request.get_json()["id"] ])
    return get_my_jsonified_data_DB1("select * ,(select 'aktiv' from T000_status t0 where t0.key = 'akt_stueck_id' and t0.value = t1.id) as aktiv from T001_stueck t1 order by id desc;")


@app.route("/api/stueck_delete",methods = ['POST'])
def api_stueck_delete():

    global aktuelles_Stueck_txt
    
    set_sql_data_DB1("delete from T001_stueck where id = ?",   [request.get_json()["id"] ])
    return get_my_jsonified_data_DB1("select * ,(select 'aktiv' from T000_status t0 where t0.key = 'akt_stueck_id' and t0.value = t1.id) as aktiv from T001_stueck t1 order by id desc;")



@app.route("/api/stueckerzeugen",methods = ['POST'])
def api_stueckerzeugen():
    global aktuelles_Stueck
    temp = aktuelles_Stueck
    set_sql_data_DB1("insert into T001_stueck (beschreibung_1, beschreibung_2, jahr) values( 'NEU' , 'NEU' , '" +datetime.now().strftime("%Y")+"' );",[])
    aktuelles_Stueck = str(json.loads(get_my_jsonified_data_DB1("select max(id) id from T001_stueck" ) )[0]["id"])

    set_sql_data("""CREATE TABLE T002_kanaele 
                 (id INTEGER PRIMARY KEY 
                 , midi_kanal int
                 , maskierung int 
                 , midi_befehl char(4)
                 , frequenz varchar(40)
                 , beschreibung_1 varchar(300)
                 , beschreibung_2 varchar(300)
                 , gruppe int
                 , aktiv int
                 , microcheck int
                 , muss_geprueft_werden int
                 , akt_value int 
                 )""",[])


    kanaele_aus_db1 = json.loads(get_my_jsonified_data_DB1("select  id , midi_kanal ,maskierung ,midi_befehl,frequenz,beschreibung_1,beschreibung_2, gruppe, aktiv,microcheck, muss_geprueft_werden from T002_kanaele order by 1"))
    for kanal_aus_db1 in kanaele_aus_db1:
                
        set_sql_data("""insert into T002_kanaele 
        ( id 
        , midi_kanal 
        ,maskierung 
        ,midi_befehl
        ,frequenz
        ,beschreibung_1
        ,beschreibung_2
        , gruppe
        , aktiv
        ,microcheck
        , muss_geprueft_werden,akt_value) values (?,?,?,?,?,?,?,?,?,?,?,0) """,
        [
            int(kanal_aus_db1["id"])
            ,kanal_aus_db1["midi_kanal"]
            ,kanal_aus_db1["maskierung"]
            ,kanal_aus_db1["midi_befehl"]
            ,kanal_aus_db1["frequenz"]
            ,kanal_aus_db1["beschreibung_1"]
            ,kanal_aus_db1["beschreibung_2"]
            ,kanal_aus_db1["gruppe"]
            ,kanal_aus_db1["aktiv"]
            ,kanal_aus_db1["microcheck"]
            ,kanal_aus_db1["muss_geprueft_werden"]
         ])
    
    set_sql_data("""CREATE TABLE T004_ablauf 
                 (id INTEGER PRIMARY KEY   AUTOINCREMENT
                 , ablauf_id int
                 , stichwort varchar(1000)
                 , szene varchar(1000)
                 , aktion varchar(8000) )""",[])


    aktuelles_Stueck = temp
    return api_stuecke()


########################################################################################################################
############################################## Kanäle IN DER DB 1!!!!!!!!!!!!!!!!
########################################################################################################################
@app.route("/t002_db1_kanaele") 
def t002_db1_kanaele():
    if local(request):
        return local(request)
    global aktuelles_Stueck_txt
    
    return render_template('t002_kanaele.html', api='/api/db1/', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)


########################################################################################################################

@app.route("/api/db1/kanaele",methods = ['POST'])
def api_db1_kanaele():
    return get_my_jsonified_data_DB1('select * from T002_kanaele order by id')
########################################################################################################################

@app.route("/api/db1/kanal_save",methods = ['POST'])
def api_db1_kanal_save():
    set_sql_data_DB1("""update T002_kanaele set 
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
                   , on_to_int(request.get_json()["muss_geprueft_werden"])
                   , on_to_int(request.get_json()["microcheck"])
                   , request.get_json()["id"]
                   ])
    return get_my_jsonified_data_DB1('select * from T002_kanaele order by id')
########################################################################################################################


########################################################################################################################
############################################## Kanäle
########################################################################################################################
@app.route("/t002_kanaele") 
def t002_kanaele():
    if local(request):
        return local(request)
    global aktuelles_Stueck_txt

    return render_template('t002_kanaele.html', api='/api/', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)
########################################################################################################################

@app.route("/api/kanaele",methods = ['POST'])
def api_kanaele():
    return get_my_jsonified_data('select * from T002_kanaele order by id')
########################################################################################################################

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
                   , on_to_int(request.get_json()["muss_geprueft_werden"])
                   , on_to_int(request.get_json()["microcheck"])
                   , request.get_json()["id"]
                   ])
    return get_my_jsonified_data('select * from T002_kanaele order by id')
########################################################################################################################


#######################################################################################################################
############################################## Ablauf
########################################################################################################################
@app.route("/t004_ablauf") 
def t004_ablauf():
    if local(request):
        return local(request)
    global aktuelles_Stueck_txt

    return render_template('t004_ablauf.html', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)

@app.route("/api/ablauf",methods = ['POST'])
def api_ablauf():
    return get_my_jsonified_data('select * from t004_ablauf order by ablauf_id')

@app.route("/api/ablauf_neu",methods = ['POST'])
def api_ablauf_neu():
    result = get_my_jsonified_data('select id, 0 as value from T002_kanaele order by id')
    set_sql_data("insert into t004_ablauf (ablauf_id, aktion, stichwort,szene) values ((select ifnull(max(ablauf_id)+1,1) from t004_ablauf),?,'','' )" ,[result] )
    return get_my_jsonified_data('select * from t004_ablauf order by ablauf_id')


@app.route("/api/ablauf_save",methods = ['POST'])
def api_ablauf_save():
    set_sql_data("update t004_ablauf set stichwort = ?,szene = ? where id = ?",
                 [request.get_json()["stichwort"],request.get_json()["szene"],request.get_json()["id"]])
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

@app.route("/api/ablauf_copy",methods = ['POST'])
def api_ablauf_copy():
    ablauf_id = json.loads(get_my_jsonified_data('select ablauf_id from t004_ablauf where id = ' + str(request.get_json()["id"]) ))[0]["ablauf_id"]
    print(ablauf_id)
    if request.get_json()["richtung"] == 1: ##copy down
        set_sql_data("update t004_ablauf set ablauf_id = ablauf_id + 1 where ablauf_id > ?",
                 [ablauf_id])    
        
        set_sql_data("""insert into t004_ablauf (ablauf_id, aktion, stichwort,szene)
                        select ablauf_id + 1, aktion, stichwort,szene from t004_ablauf where id = ?
                     """,
                 [request.get_json()["id"] ])
    # else:                                   ##copy up
    #     set_sql_data("update t004_ablauf set ablauf_id = ablauf_id - 1 where id = ?",
    #              [request.get_json()["id"] ])
    #     set_sql_data("update t004_ablauf set ablauf_id = ablauf_id + 1 where id != ? and ablauf_id = ?",
    #              [request.get_json()["id"], ablauf_id -1])  
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
    set_sql_data("insert into t004_ablauf (ablauf_id, aktion, stichwort ,szene) values (?,?,'','' )" ,[ablauf_id + 1, result] )
    return get_my_jsonified_data('select * from t004_ablauf order by ablauf_id')

@app.route("/api/ablauf_del",methods = ['POST'])
def api_ablauf_del():
    ablauf_id = json.loads(get_my_jsonified_data('select ablauf_id from t004_ablauf where id = ' + str(request.get_json()["id"]) ))[0]["ablauf_id"]
    print(ablauf_id)

    ## Verschieben nach oben
    set_sql_data("update t004_ablauf set ablauf_id = ablauf_id - 1 where ablauf_id > ?",
                [ablauf_id ])
    
    # Löschen
    set_sql_data("delete from t004_ablauf where id = ? " ,[str(request.get_json()["id"])] )
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
    if local(request):
        return local(request)
    global aktuelles_Stueck_txt
    return render_template('t005_produktion.html', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)


@app.route("/api/ablauf_akt_punkt",methods = ['POST'])
def ablauf_akt_punkt():
    return get_my_jsonified_data_DB1("select * from t000_status where key = 'akt_ablauf' ")

@app.route("/api/szeneliste",methods = ['POST'])
def api_szeneliste():
    akt_ablauf = str(int(json.loads(get_my_jsonified_data_DB1("select * from t000_status where key = 'akt_ablauf'"))[0]["value"]))
    return get_my_jsonified_data('select ablauf_id,szene , ' + akt_ablauf + ' akt_ablauf from t004_ablauf  order by ablauf_id ')


@app.route("/api/ablauf_produktion",methods = ['POST'])
def api_ablauf_produktion():
    return get_my_jsonified_data('select * from t004_ablauf where ablauf_id >= '+request.get_json()["ablauf_id"]+' order by ablauf_id LIMIT 4')

@app.route("/api/ablauf_produktion_weiter",methods = ['POST'])
def api_ablauf_produktion_weiter():
    akt_ablauf = str(int(json.loads(get_my_jsonified_data_DB1("select * from t000_status where key = 'akt_ablauf'"))[0]["value"]) +1)
    max_ablauf = str(int(json.loads(get_my_jsonified_data("select max(ablauf_id)  a from t004_ablauf"))[0]["a"]) )
    if int(akt_ablauf) >= int(max_ablauf):
        akt_ablauf = max_ablauf
    set_sql_data_DB1("update t000_status set value = ? where key = 'akt_ablauf'",[akt_ablauf ])
    midi_send(akt_ablauf)
    return get_my_jsonified_data('select * from t004_ablauf where ablauf_id >= '+ akt_ablauf + ' order by ablauf_id LIMIT 4',)

@app.route("/api/ablauf_produktion_zurueck",methods = ['POST'])
def api_ablauf_produktion_zurueck():
    akt_ablauf = str(int(json.loads(get_my_jsonified_data_DB1("select * from t000_status where key = 'akt_ablauf'"))[0]["value"]) -1)
    if int(akt_ablauf) <= 0:
        akt_ablauf = '1'
    
    set_sql_data_DB1("update t000_status set value = ? where key = 'akt_ablauf'",[akt_ablauf ])
    midi_send(akt_ablauf)
    return get_my_jsonified_data('select * from t004_ablauf where ablauf_id >= '+ akt_ablauf + ' order by ablauf_id LIMIT 4',)

@app.route("/api/ablauf_produktion_gehezu",methods = ['POST'])
def api_ablauf_produktion_gehezu():
    akt_ablauf = str(request.get_json()["ablauf_id"])
    set_sql_data_DB1("update t000_status set value = ? where key = 'akt_ablauf'",[akt_ablauf ])
    
    midi_send(akt_ablauf)

    return get_my_jsonified_data('select * from t004_ablauf where ablauf_id >= '+ akt_ablauf + ' order by ablauf_id LIMIT 4',)



@app.route("/api/maskieren_toggle",methods = ['POST'])
def api_maskieren_toggle():
    maskierung = int(json.loads(get_my_jsonified_data("select maskierung from T002_kanaele where id = " + str(request.get_json()["id"]) ))[0]["maskierung"])
    maskierung = 1- maskierung

    set_sql_data('update T002_kanaele set maskierung = ? where id = ?',[ str(maskierung), str(request.get_json()["id"])])    
    
    return {"return": maskierung} 


def midi_send(akt_ablauf):
    akt_ablauf = str(akt_ablauf)
    aktion = json.loads(json.loads(get_my_jsonified_data('select aktion from t004_ablauf where ablauf_id = '+ akt_ablauf ))[0]['aktion'])
    kanaele = json.loads(get_my_jsonified_data('select id, midi_kanal, midi_befehl,akt_value from t002_kanaele where aktiv = 1 and maskierung = 0'))
    
    for kanal in kanaele:
        neue_aktion = aktion_kanal(aktion, kanal["id"])
        if kanal["akt_value"] != neue_aktion:
            midi_send_message(kanal, neue_aktion, kanal["akt_value"])



def aktion_kanal(aktionen, id):
    for aktion in aktionen:
        if aktion["id"] == id:
            return aktion["value"]

def midi_send_message(kanal, neue_aktion, alterwert):
    global out
    
    ###################################
    ## ToDo Anpassung ans Mischpult
    ###################################


    print(f"Kanel: {kanal['id']} alter Wert: {alterwert} -> neuer Wert: {neue_aktion}", kanal)
    if neue_aktion == 1:
        midi_value = 127
    if neue_aktion == 0:
        midi_value = 0
    
    if out.is_port_open():
        out.send_message([int(kanal["midi_befehl"]), int(kanal["midi_kanal"]),midi_value])
        #out.send_message([192,45])
    else:
        print('Es ist kein Port offen!')
    if kanal["akt_value"] != neue_aktion:
        
        set_sql_data("""update T002_kanaele set akt_value = ? where id = ?"""
                 
                 ,[
                     neue_aktion, kanal['id']
                   ])




#######################################################################################################################
############################################## Micro Check
########################################################################################################################
@app.route("/t006_microcheck") 
def t006_microcheck():
    global aktuelles_Stueck_txt

    return render_template('t006_microcheck.html', aktuelles_Stueck_txt=aktuelles_Stueck_txt, g_jinja=g_jinja)

@app.route("/api/microcheck_toggle",methods = ['POST'])
def api_microcheck_toggle():
    microcheck = int(json.loads(get_my_jsonified_data("select microcheck from T002_kanaele where id = " + str(request.get_json()["id"]) ))[0]["microcheck"])
    microcheck = 1- microcheck

    set_sql_data('update T002_kanaele set microcheck = ? where id = ?',[ str(microcheck), str(request.get_json()["id"])])    
    
    return api_kanaele()


@app.route("/api/checkmenge",methods = ['POST'])
def api_checkmenge():
    microcheck = json.loads(get_my_jsonified_data("select microcheck as microcheck, count(1) checkmenge from T002_kanaele where aktiv = 1 group by microcheck"))
     
    
    return microcheck


#######################################################################################################################
def on_to_int(x):
    if str(x) == 'on' or str(x) == '1':
        return 1
    else:
        return 0

def get_my_jsonified_data_DB1(sql):
    cnx_db1 = sqlite3.connect(data_folder / "db" / "db.db")
    data = pd.read_sql_query(sql, cnx_db1).to_json(orient ='records')
    cnx_db1.close()
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
    con.close()
    return {}

def set_sql_data(sql,para):
    t = str(aktuelles_Stueck)+".db"
    con = sqlite3.connect(data_folder / "db" / t)
    cur = con.cursor()
    print(sql, str(para))
    cur.execute(sql,para)
    con.commit()
    con.close()
    return {}

def Midi_Verbindung_oeffnen(port_id):
    print ("Midi Verbindung öffnen: " + str(port_id))
    global out
    #try:
    if out == None:
        out =rtmidi.MidiOut()
    if out.is_port_open():
        out.close_port()
        out.open_port(int(port_id))
        print("Änderung der Verbindung zum Port " + str(port_id) +" " + str(int(out.is_port_open())))
    else:
        out =rtmidi.MidiOut()
        out.open_port(int(port_id))
        print("Verbindung zum Port " + str(port_id) +" " + str(int(out.is_port_open())))
    #except:
    #    out = None
    #    print("Es konnte keine Verbindung zum Port " + str(port_id) +" aufgebaut werden")

def start():
    global port_id
    global aktuelles_Stueck
    global aktuelles_Stueck_txt
    try:
        port_id = json.loads(get_my_jsonified_data_DB1("select value id from T000_status where key = 'port_id';"))[0]["id"]
        Midi_Verbindung_oeffnen(port_id)
        aktuelles_Stueck = json.loads(get_my_jsonified_data_DB1("select value id from T000_status where key = 'akt_stueck_id';"))[0]["id"]
        aktuelles_Stueck_txt = json.loads(get_my_jsonified_data_DB1("select beschreibung_1 id from T001_stueck where id = "+str(aktuelles_Stueck)+";") )[0]["id"]
    except:
        aktuelles_Stueck = 1
        aktuelles_Stueck_txt = 'KEIN STÜCK'


if __name__ == '__main__':
    out = None
    start()
    app.run(host="0.0.0.0",debug=True )
    #flask --debug --app app run