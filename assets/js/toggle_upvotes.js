
class ToggleUpvote {

    constructor(toggleELement){
        this.toggler = toggleELement;
        this.toggleUpvote();
    }

    toggleUpvote(){

        $(this.toggler).click(function(e){

            e.preventDefault();
            let self = this;

            $.ajax({
                type : 'POST',
                url : $(self).attr('href'),
            })
            .done(function(data){
                let upvoteCount = parseInt($(self).attr('data-upvotes'));
                // console.log(upvoteCount);
                    console.log('Data*****',data);
                if(data.data.deleted == true){
                    upvoteCount -=1;
                }else{
                    upvoteCount += 1;
                }

                $(self).attr('data-upvotes', upvoteCount);
                $(self).html(`${upvoteCount} <i class="fas fa-arrow-up"></i>`);
            })
            .fail(function(errorData){
                console.log('error in completing the request',errorData);
            }); 

        });

    }

}