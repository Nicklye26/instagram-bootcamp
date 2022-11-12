import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";
import { database, storage } from "../firebase";

const InstagramPost = (props) => {
  const [input, setInput] = useState("");
  const [fileInput, setFileInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);

  const POSTS_FOLDER_NAME = "posts";
  const IMAGES_FOLDER_NAME = "images";

  const handlePostMessageChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFileInputFile(e.target.files[0]);
    setFileInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const imageRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`,
    );
    uploadBytes(imageRef, fileInputFile).then(() => {
      getDownloadURL(imageRef).then((downloadURL) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadURL,
          text: input,
        });
      });
    });
    setInput("");
    setFileInput("");
    setFileInputFile(null);
  };

  console.log("file", fileInputFile);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>{props.loggedInUser ? props.loggedInUser.email : null}</p>
        <input type="file" value={fileInput} onChange={handleFileChange} />
        <input
          type="text"
          id="message"
          required
          onChange={handlePostMessageChange}
        />
        <input type="submit" value="Send" disabled={!input} />
      </form>
    </div>
  );
};

export default InstagramPost;

/* export default class InstagramPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };
  }

  handleFileInputChange = (event) => {
    this.setState({
      fileInputFile: event.target.files[0],
      fileInputValue: event.target.value,
    });
  };

  handleTextInputChange = (event) => {
    this.setState({ textInputValue: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`,
    );

    uploadBytes(fileRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          text: this.state.textInputValue,
          authorEmail: this.props.loggedInUser.email,
        });

        this.setState({
          fileInputFile: null,
          fileInputValue: "",
          textInputValue: "",
        });
      });
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.props.loggedInUser && <p>{this.props.loggedInUser.email}</p>}
          <input
            type="file"
            value={this.state.fileInputValue}
            onChange={this.handleFileInputChange}
          />
          <br />
          <input
            type="text"
            value={this.state.textInputValue}
            onChange={this.handleTextInputChange}
          />
          <input type="submit" value="Send" />
        </form>
      </div>
    );
  }
}
*/
