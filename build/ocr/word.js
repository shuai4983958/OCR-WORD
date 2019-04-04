'use strict';
import React from "react";
import ReactDom from "react-dom";
import Item from "antd/lib/list/Item";

class Result extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.result)
        this.state = {
       
        };
   }
    /**
     * 本地文件导入
     */
    fileImport() {
        const selectedFile = document.getElementById('files').files[0];
        let url = null
        if (window.createObjectURL !== undefined) { // basic
          url = window.createObjectURL(selectedFile)
        } else if (window.URL !== undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(selectedFile)
        } else if (window.webkitURL !== undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(selectedFile)
        }
        console.log(url);
        const image = new Image();
        //至关重要
        image.crossOrigin = '';
        image.src = url;
        image.width = 300;
        document.body.appendChild(image)
        image.onload = ()=>{
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL();
            this.upload(dataURL)
        }
   }
   /**
    * 上传
    */
   upload(){
      window.location.href = 'download';
   }
   render() {
     return <div>

          <input type="file" id="files" onChange={this.fileImport.bind(this)} ></input>
          {
            this.props.result.words_result.map((item,index)=>{
              return (
                <div key={index}>{item.words}</div>
              )
            })
          }
     </div>
   }
}

Result.defaultProps = {
    
};
function result(result) {
    ReactDom.render(<Result result={result}/>, document.getElementById("app"));
}

try {
    window.result = result;
} catch (e) {
    module.exports = result;
}