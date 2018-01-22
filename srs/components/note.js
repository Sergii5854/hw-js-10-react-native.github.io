import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput
} from 'react-native'


export default class Note extends Component {
  render() {
    return (
        <View key={this.props.keyVal} style={styles.note}>

          <View style={styles.titleDate}>
            {this.props.val.url
                ? <Image
                    style={styles.image}
                    source={{uri: this.props.val.url}}/>
                : null}
            <View>
              {this.props.val.date === null
                  ? <Text style={styles.addDateText}>Date...</Text>
                  : <Text style={styles.addDateText}>{this.props.val.date}</Text>}
            </View>
          </View>

          <TextInput style={styles.noteText}
                     onChangeText={this.props.onChangeText}>
            <Text>{this.props.val.note}</Text>
          </TextInput>

          <View style={styles.btnContainer}>

            <TouchableOpacity
                onPress={() => {this.props.selectImage(this.props.val)}}
                underlayColor='#dddddd'
                underlineColorAndroid='transparent'>
              <Text style={styles.btnText}>Upload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={()=>{this.props.addDate(this.props.val)}}
                underlayColor='#dddddd'
                underlineColorAndroid='transparent'>
              <Text style={styles.btnText}>Change Date</Text>
            </TouchableOpacity>

          </View>

          <TouchableOpacity onPress={this.props.remove} style={styles.noteRemove}>
            <Text style={styles.noteRemoveText}>X</Text>
          </TouchableOpacity>


        </View>
    );
  }
}

const styles = StyleSheet.create({
  note: {
    position: 'relative',
    padding: 10,
    paddingBottom: 20,
    paddingRight: 100,
    borderBottomWidth: 2,
    borderBottomColor: '#E91E63'

  },
  noteText: {
    marginLeft: 5,
    paddingLeft: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#E91E63'
  },
  noteRemove: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    borderRadius: 50,
    padding: 10,
    top: 50,
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    elevation: 8
  },
  noteRemoveText: {
    color: 'white',
  },
  titleDate: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 15,
    left: 20,
    top: 5
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5,
    left: 10,
    right: 10,
    top: 5
  },
  image: {
    width: 120,
    height: 100,
    backgroundColor: 'white'
  },


});