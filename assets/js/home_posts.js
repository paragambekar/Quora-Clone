{
    console.log('Inside home_post.js');
    let createPost = function(){

        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type : 'post',
                url : '/posts/create',
                data : newPostForm.serialize(),
                success : function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    new PostComments(data.data.post._id);
                    new ToggleUpvote($(' .toggle-upvote-button',newPost));
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                    // clear the form after submit
                    newPostForm.trigger("reset");
                },
                error : function(error){
                    console.log(error.responseText);
                },

            });
            console.log("Created post with ajax");

        });

    }

    // method to create new post in DOM 
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <div class="singlePost">
        <p>
            <div class="head-div">
                <div>
                <p>
                <strong>
                ${ post.user.name } 
                </strong>
                </p>
                </div>
            
                <div>
            <small>
                <a class="delete-post-button top-right" href="/posts/destroy/${post._id}"><i class="fas fa-trash-alt"></i></a>
                
            </small>
                </div>
           
            ${ post.content }
            <br>
            

            <p>
           
             <a class="toggle-upvote-button" data-upvotes = "0" href="/upvotes/toggle/?id=${post._id}&type=Post">
                    0 <i class="fas fa-arrow-up"></i>

                </a>   
            </p>

        </p>
        <div class="post-comments">
                <form id="post-${ post._id }-comments-form" action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id }" >
                    <input type="submit" value="Add Comment">
                </form>
    
            <div class="post-comments-list">
                <ul id="post-comments-${ post._id }">
                    
                </ul>
            </div>
        </div>
        </div>
    </li>`)

    }

     // method to delete a post 
     // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }


    createPost(); 
    convertPostsToAjax();  
}

