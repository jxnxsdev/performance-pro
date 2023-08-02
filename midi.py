#https://github.com/SpotlightKid/python-rtmidi/tree/master/examples
#https://spotlightkid.github.io/python-rtmidi/rtmidi.html#rtmidi.MidiOut

#sudo apt-get install libasound2
#sudo apt-get install libasound2-dev
# sudo apt-get install libjack-dev
# sudo apt-get install libjack-jackd2-dev
# sudo apt-get intall jackd2
# class raum:
    
#     def __init__(self, nr, verwendung): # Für die Initialisierung - hier werden auch die Variablen Deklariert
#         self.nr = nr
#         self.verwendung = verwendung
    
#     def __repr__(self): # Standart Ausgabe einer Classe
#         return f"Hallo ich bin raum {self.nr} mit der Verwendung {self.verwendung}"

# class besprechungsraum(raum): #Vererbung
#     def __init__(self, nr, verwendung, presentationsflaeche):
#         raum.__init__(self,nr,verwendung) # Aufruf der Basisklasse und Initialisierung damit die Variablen der Basisklasse auch vorhanden ist
#         self.presentationsflaeche = presentationsflaeche


def midi_ports():
    import time
    import rtmidi
    midiout = rtmidi.MidiOut()
    return midiout.get_ports()

print(midi_ports())

class midi:
    
    def __init__(self): # Für die Initialisierung - hier werden auch die Variablen Deklariert
        import rtmidi
        midiout = rtmidi.MidiOut()
        return midiout.get_ports()
        


    # def open_port(i):
    #     midiout.open_port(i)

    # def send(control):
    #     midiout.send_message(control)

    
#del midiout