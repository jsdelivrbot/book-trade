import { hashHistory } from 'react-router';
import Auth from '../modules/Auth';
import React, { PropTypes } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
var j=0;
var desc = '';
var content = '';
var helper = [];
var helper2 = [];
var trades="";

class DashboardPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      secretData: '',
      input: ''
    };
    this.onChange = this.onChange.bind(this);
    this.AddBook = this.AddBook.bind(this);
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    if(document.getElementById("userBooks"))
    {
      document.getElementById("userBooks").innerHTML="";
    }
    var that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        document.getElementById("userBooks").innerHTML="";
        document.getElementById("tradeBooks").innerHTML="";


        //console.log(xhr.response.books);
        trades="";
        helper=[];
        helper2=[];
        document.getElementById("userBooks").innerHTML+="<div id=\"loader2\"></div>";
        document.getElementById('loader2').style.display="inline-block";
        document.getElementById('loader2').style.width="100%";

        //console.log(xhr.response);
        trades = xhr.response.tradebooks;

        j=0;
        desc = '';
        content = '';
        helper = [];
        helper2=[];
        that.loadBooks(xhr.response.books);
      }else{
        hashHistory.push('/login');
      }
    });
    xhr.send();
  }



  ClearAndDipslayUserBooks(){
    var that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        document.getElementById("userBooks").innerHTML="";
        document.getElementById("tradeBooks").innerHTML="";


        helper=[];
        helper2=[];

        trades="";

        document.getElementById("userBooks").innerHTML+="<div id=\"loader2\"></div>";
        document.getElementById('loader2').style.display="inline-block";
        document.getElementById('loader2').style.width="100%";

        //console.log(xhr.response);
        trades = xhr.response.tradebooks;

        j=0;
        desc = '';
        content = '';
        helper = [];
        helper2=[];


        that.loadBooks(xhr.response.books);
      }else{
        console.log("error sorry");
      }
    });
    xhr.send();
  }
  loadTradeBooks(ids){

    var that =this;
    if(j===ids.length)
    {
      desc = '';
      content = '';
      j=0;
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.googleapis.com/books/v1/volumes/'+ids[j]);
    j++;
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        that.loadTradeBooks(ids);
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
      content = "<div id=user"+j.toString()+" class='card'><img src="+xhr.response.volumeInfo.imageLinks.smallThumbnail+" alt='Avatar' title=\""+desc+"\" style=\"width:100%\"/><div id=\"decline"+xhr.response.id+"\" class=\"button\"><a class=\"delbutton\">DECLINE</a></div><div id=\"accept"+xhr.response.id+"\" class=\"button2\"><a class=\"delbutton\">ACCEPT</a></div><div class=\"infos\"><h4><b>"+xhr.response.volumeInfo.title+"</b></h4><p>"+expand(xhr.response.volumeInfo.authors)+"</p></div></div>";
        if(document.getElementById("tradeBooks"))
        {
          document.getElementById("tradeBooks").innerHTML+=content;
        }
        helper2.push(xhr.response.id);
        helper2.map((element)=>{
          if(document.getElementById("accept"+element))
          {
            document.getElementById("accept"+element).addEventListener("click",function(event){
             that.acceptBook(element);
            });
          }
          if(document.getElementById("decline"+element))
          {
            document.getElementById("decline"+element).addEventListener("click",function(event){
            that.declineBook(element);
            });
          }
        });
      }else{
        that.loadTradeBooks(ids);
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
      if(document.getElementById("userBooks"))
      {
        document.getElementById("userBooks").removeChild(document.getElementById("loader2"));
      }
      that.loadTradeBooks(trades);
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.googleapis.com/books/v1/volumes/'+ids[j]);
    j++;
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
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
        content = "<div id=user"+j.toString()+" class='card'><img src="+xhr.response.volumeInfo.imageLinks.smallThumbnail+" alt='Avatar' title=\""+desc+"\" style=\"width:100%\"/><div id=\"delete"+xhr.response.id+"\" class=\"button\"><a class=\"delbutton\">DELETE</a></div><div class=\"infos\"><h4><b>"+xhr.response.volumeInfo.title+"</b></h4><p>"+expand(xhr.response.volumeInfo.authors)+"</p></div></div>"
        if(document.getElementById("userBooks"))
        {
          document.getElementById("userBooks").innerHTML+=content;
        }
        helper.push(xhr.response.id);
        helper.map((element)=>{
          if(document.getElementById("delete"+element))
          {
            document.getElementById("delete"+element).addEventListener("click",function(event){
            //  console.log(element);
            that.deleteBook(element);
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

  acceptBook(id)
  {
    var that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/accept/'+id);
    document.getElementById("loader").style.display="block";
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      document.getElementById("loader").style.display="none";
      if (xhr.status === 200) {
        const xhr2 = new XMLHttpRequest();
        xhr2.open('post', '/api/decline/'+id);
        document.getElementById("loader").style.display="block";
        xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr2.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr2.responseType = 'json';
        xhr2.addEventListener('load', () => {
          document.getElementById("loader").style.display="none";
          if (xhr2.status === 200) {
            helper2=[];
            that.ClearAndDipslayUserBooks();
          }else{
          }
        });
        xhr2.send();
      }else{
      }
    });
    xhr.send();
  }

  declineBook(id){
    var that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/decline/'+id);
    document.getElementById("loader").style.display="block";
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      document.getElementById("loader").style.display="none";
      if (xhr.status === 200) {
        helper2=[];
        that.ClearAndDipslayUserBooks();
      }else{
      }
    });
    xhr.send();
  }


  deleteBook(id)
  {
    var that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('delete', '/api/book/'+id);
    document.getElementById("loader").style.display="block";
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      document.getElementById("loader").style.display="none";
      if (xhr.status === 200) {
        helper = [];
        helper2=[];

        that.ClearAndDipslayUserBooks();
      }else{
      }
    });
    xhr.send();
  }

  AddBookToDataBase(id){
    var that=this;
    helper=[];
    helper2=[];
    const xhr2 = new XMLHttpRequest();
    document.getElementById("loader").style.display="block";
    document.getElementById("searchResult").innerHTML="";
    this.setState({input : ''});
    xhr2.open('post', '/api/book/'+id);
    xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr2.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr2.responseType = 'json';
    xhr2.addEventListener('load', () => {
      document.getElementById("loader").style.display="none";
      if (xhr2.status === 200) {
        that.ClearAndDipslayUserBooks();
      }else{
      }
    });
    xhr2.send();
  }

  AddBook() {
    var that = this;
    if(this.state.input.toString().trim()==="")
    {
      return;
    };
    document.getElementById("loader").style.display="block";
    document.getElementById("searchResult").innerHTML="";
    const xhr = new XMLHttpRequest();
    var url = "https://www.googleapis.com/books/v1/volumes?q="+this.state.input.toString()+"&maxResults=5";
    xhr.open('get', url);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      document.getElementById("loader").style.display="none";
      if (xhr.status === 200) {
        var desc,content="";
        xhr.response.items.map((element,i) => {
          if(element.volumeInfo.description)
          {
            desc=element.volumeInfo.description;
          }
          else if(element.searchInfo)
          {
            if(element.searchInfo.textSnippet)
            {
              desc = element.searchInfo.textSnippet;
            }
          }
          else {
            desc= element.volumeInfo.title;
          }
          content = "<div id="+i.toString()+" class='card'><img src="+element.volumeInfo.imageLinks.smallThumbnail+" alt='Avatar' title=\""+desc+"\" style=\"width:100%\"/><div class=\"infos\"><h4><b>"+element.volumeInfo.title+"</b></h4><p>"+expand(element.volumeInfo.authors)+"</p></div></div>"
          document.getElementById("searchResult").innerHTML+=content;
        })
        for (var i = 0; i < 5; i+=1) {
          document.getElementById(i.toString()).addEventListener('click', function(event){
            that.AddBookToDataBase(xhr.response.items[parseInt(this.id)].id);
          });
        }
      }
    });
    xhr.send();
  }
  onChange(event)  {
    this.setState({input:  event.target.value});
  }


  /**
   * Render the component.
   */
  render() {
    return (<Dashboard input={this.state.input} secretData={this.state.secretData} AddBook={this.AddBook} onChange={this.onChange}/>);
  }

}


function expand(arr)
{
  var str = '';
  arr.map(function(element){str += element+" "});
  return str;
}


export default DashboardPage;
