{
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
                    console.log(newPost);
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
        <p>
           
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
           
            ${ post.content }
            <br>
            <small>
            ${ post.user.name } 
            </small>
        </p>
        <div class="post-comments">
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id }" >
                    <input type="submit" value="Add Comment">
                </form>
    
            <div class="post-comments-list">
                <ul id="post-comments-${ post._id }">
                    
                </ul>
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