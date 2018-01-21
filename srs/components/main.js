import React, {Component} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  DatePickerAndroid
} from 'react-native'


import Note from './note';
import ImagePicker from 'react-native-image-picker'
import RNFS from 'react-native-fs'

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      noteArray: [],
      noteText: '',
      avatarSource: {},
      date: null,
      url: ''
    };

    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.changeText = this.changeText.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.storageData = this.storageData.bind(this);
    this.addDate = this.addDate.bind(this);
    this.updateText = this.updateText.bind(this);
  }

  componentWillMount() {
    const filePath = RNFS.DocumentDirectoryPath + '/toDoList.json';
    if (RNFS.exists(filePath)) {
      RNFS.readFile(filePath)
          .then((data) => {
            this.setState({
              noteArray: data ? JSON.parse(data) : []
            })
          })
    } else {
      this.storageData([])
    }
  }

  storageData(data) {
    const filePath = RNFS.DocumentDirectoryPath + '/toDoList.json';
    RNFS.writeFile(filePath, JSON.stringify(data));
    this.setState({
      noteArray: data
    })
  }

  async addDate(note) {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });
      let newDate;
      if (typeof year === 'undefined') {
        newDate = new Date()

      } else {
        newDate = year + '/' + month + '/' + day
      }
      let notes = this.state.noteArray;
      notes.forEach((item) => {
        if (item.id === note.id) {
          item.date = newDate
        }
      });

      this.setState({noteArray: notes});

      this.storageData(notes)
    } catch ({code, message}) {
      console.log('Cannot open date picker', message)
    }
  }

  addNote() {
    if (this.state.noteText) {
      const d = new Date();
      let notes = this.state.noteArray;

      notes.push({
        'id': Math.random() * 100,
        'date': this.state.date || d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(),
        'note': this.state.noteText,
        'url': ''
      });
      this.storageData(notes);

      this.setState({
        noteArray: notes,
        noteText: '',
        avatarSource: {},
        date: null
      })
    }
  }

  selectImage(note) {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };


    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response)

      if (response.didCancel) {
        console.log('User cancelled image picker')
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      }
      else {
        let filePath = RNFS.DocumentDirectoryPath + response.fileName
        console.log('response', response)
        RNFS.writeFile(filePath, response.data, 'base64')
            .then(() => {
              console.log('saved file', filePath)
            })
            .catch(err => {
              console.log('error save file', err)
            })

        let notes = this.state.noteArray
        notes.forEach((item) => {
          if (note.id === item.id) {
            item.url = response.uri
          }
        })

        this.setState({
          noteArray: notes
          // avatarSource: { uri: 'file://' + filePath }
        }, () => { console.log('avatar', this.state.avatarSource) })
        //this.state.url = this.state.avatarSource.uri
        this.storageData(this.state.noteArray)
      }
    })
  }


  removeNote(key) {
    let notes = this.state.noteArray;
    notes.splice(key, 1);
    this.setState({
      noteArray: notes
    });
    this.storageData(notes)
  }

  changeText(noteText) {

    this.setState({
      noteText: noteText
    });

  }

  updateText(newText, index) {
    this.state.noteArray[index].note = newText;
    this.setState({
      noteArray: this.state.noteArray.concat([])
    }, () => {
      this.storageData(this.state.noteArray)
    })
  }

  render() {
    let notes = this.state.noteArray.map((note, index) => {
      return <Note
          storageFunc={this.storageData}
          key={index}
          keyVal={index}
          val={note}
          remove={() => this.removeNote(index)}
          onChangeText={(newText) => this.updateText(newText, index)}
          selectImage={this.selectImage}
          addDate={this.addDate}
      />
    });

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}> ToDo List </Text>
          </View>
          <ScrollView style={styles.scrollContainer}>
            {notes}
          </ScrollView>

          <View style={styles.footer}>
            <TextInput
                style={styles.textInput}
                placeholder='add  note'
                onChangeText={(noteText)=> this.setState({noteText})}
                value={this.state.noteText}
                placeholderTextColor='white'
                underlineColorAndroid='transparent'>
            </TextInput>
          </View>
          <TouchableOpacity onPress={ this.addNote } style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 10,
    borderBottomColor: '#ddd'
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    padding: 26
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 100
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  textInput: {
    alignSelf: 'stretch',
    color: '#fff',
    padding: 20,
    backgroundColor: '#252525',
    borderTopWidth: 2,
    borderTopColor: '#ededed'
  },
  addButton: {
    position: 'absolute',
    zIndex: 11,
    right: 20,
    bottom: 90,
    backgroundColor: '#E91E63',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24
  }
});