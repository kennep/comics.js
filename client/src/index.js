var React = require('react');
var jquery = require('jquery');

var ComicList = React.createClass({
	getInitialState: function() {
		return {
			comics: [],
			error: null
		};
	},
	
	componentDidMount: function() {
		var component = this;
		jquery.ajax("/api/comics")
			.error(function(jqXHR, textStatus, errorThrown) {
				component.setState({error: textStatus + errorThrown});
			})
			.success(function(data, textStatus, jqXHR) {
				component.setState({error: null, comics: data});
			});
	},
	
	render: function() {
		return <div className="container-fluid">{this.state.comics.map(function(comic) {
			return <Comic key={comic.name} comic={comic} />
		})}</div>
	}
});

var Comic = React.createClass({
	getInitialState: function() {
		return {zoomed: false};
	},
	
	handleClick: function(event) {
		this.setState({zoomed: !this.state.zoomed});
		event.preventDefault();
	},
	
	render: function() {
		var className="comic";
		if(this.state.zoomed) className += " zoomed";
		return <div className="panel panel-default">
			<div className="panel-heading"><h3 className="panel-title">{this.props.comic.name}</h3></div>
			<div className="panel-body">
 		      <div className="comic-container">
		        <a href={this.props.comic.originalUrl} onClick={this.handleClick}><img 
				className={className} src={this.props.comic.url} /></a>
		      </div>
			  <div dangerouslySetInnerHTML={{__html: this.props.comic.title}} />
		    </div>
		</div>
	}
});

React.render(<ComicList />, document.body);
