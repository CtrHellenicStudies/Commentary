AddComment = React.createClass({

    getInitialState(){
        return {};
    },

    mixins: [ReactMeteorData],

    getMeteorData(){
      return {}
    },

    render() {

        return (

            <div className="add-comment">

                <AddCommentForm 
                    testA='test1'
                    testB='text2'
                />

                <ContextReader 
                    initWorkSlug='iliad'
                    initSubwork_n={1}
                    initLineFrom={5}
                    initLineTo={20}
                />

            </div>
        );
    }
});
