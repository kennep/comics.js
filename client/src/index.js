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
		return <div>{this.state.comics.map(function(comic) {
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
		return <div>
			<div><strong>{this.props.comic.name}</strong></div>
		    <a href={this.props.comic.originalUrl} onClick={this.handleClick}><img 
				className={className} src={this.props.comic.url} /></a>
			<div dangerouslySetInnerHTML={{__html: this.props.comic.title}} />
		</div>
	}
});

React.render(<ComicList />, document.body);
