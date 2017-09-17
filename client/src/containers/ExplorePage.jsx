import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Auth from '../modules/Auth';
import Explore from '../components/Explore.jsx';
var j=0;
var desc = '';
var content = '';
var helper = [];

class ExplorePage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);
    this.state= {secretData : "Hi secret"};
  }

  /*
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    helper = [];
    this.ClearAndDipslayUserBooks();
  }

  ClearAndDipslayUserBooks(){
    var that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/explore');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        document.getElementById("exploreBooks").innerHTML="<div id=\"loader2\"></div>";
        document.getElementById('loader2').style.display="inline-block";
        document.getElementById('loader2').style.width="100%";
        that.loadBooks(xhr.response.books);
        //console.log(xhr.response);
      }else{
        console.log("error sorry");
      }
    });
    xhr.send();
  }


  loadBooks(ids){
    var that =this;
    if(j===ids.length)
    {
      desc = '';
      content = '';
      j=0;
      document.getElementById("exploreBooks").removeChild(document.getElementById("loader2"));
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.googleapis.com/books/v1/volumes/'+ids[j].book);
    j++;
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        var owner = ids[j-1].owner;
        that.loadBooks(ids);
        //console.log(xhr.response);
        desc = '';
        content = '';
        if(xhr.response.volumeInfo.description)
        {
          desc=xhr.response.volumeInfo.description;
        }
        else if(xhr.response.searchInfo)
        {
          if(xhr.response.searchInfo.textSnippet)
          {
            desc = xhr.response.searchInfo.textSnippet;
          }
        }
        else {
          desc= xhr.response.volumeInfo.title;
        }
        content = "<div id="+j.toString()+" class='card'><img src="+xhr.response.volumeInfo.imageLinks.smallThumbnail+" alt='Avatar' title=\""+desc+"\" style=\"width:100%\"/><div id=\"trade"+xhr.response.id+"==="+owner+"\" class=\"button\"><a class=\"delbutton\">TRADE</a></div><div class=\"infos\"><h4><b>"+xhr.response.volumeInfo.title+"</b></h4><p>"+expand(xhr.response.volumeInfo.authors)+"</p></div></div>"
        if(document.getElementById("exploreBooks"))
        {
          document.getElementById("exploreBooks").innerHTML+=content;
        }
        helper.push(xhr.response.id+"==="+owner);
        helper.map((element)=>{
          if(document.getElementById("trade"+element))
          {
            document.getElementById("trade"+element).addEventListener("click",function(event){
              that.tradeBook(element);
              //  console.log(element);
            });
          }
        });
      }else{
        that.loadBooks(ids);
        console.log("error sorry");
      }
    });
    xhr.send();
  }

  tradeBook(id){
    var that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('put', '/api/trade/'+id.toString());
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log(xhr.response);
      }else{
        console.log("error sorry");
      }
    });
    xhr.send();
  }

  /**
   * Render the component.
   */
  render() {
    return (<Explore secretData={this.state.secretData}/>);
  }

}

function expand(arr)
{
  var str = '';
  arr.map(function(element){str += element+" "});
  return str;
}


export default ExplorePage;
