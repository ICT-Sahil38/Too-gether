function editProfileImage_fun(event){
    event.preventDefault();
    const form = document.getElementById('postsForm');

    const formData = new FormData(form);

    fetch('/edit_profile_image', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          toastr.success('Image editted successfully');
          setTimeout(() => window.location.reload(),2000);
        } else {
          toastr.error('Failed to edit image');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }