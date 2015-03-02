jQuery(function(jQuery) {
    
    var file_frame,
            rpggallery = {
        admin_thumb_ul: '',
        init: function() {
            this.admin_thumb_ul = jQuery('#rpg_gallery_thumbs');
            this.admin_thumb_ul.sortable({
                placeholder: '',
				revert: true,
            });
            this.admin_thumb_ul.on('click', '.rpggallery_remove', function() {
                if (confirm('Are you sure you want to delete this?')) {
                    jQuery(this).parent().fadeOut(1000, function() {
                        jQuery(this).remove();
                    });
                }
                return false;
            });
            
            jQuery('#rpg_gallery_upload_button').on('click', function(event) {
                event.preventDefault();
                if (file_frame) {
                    file_frame.open();
                    return;
                }

                file_frame = wp.media.frames.file_frame = wp.media({
                    title: jQuery(this).data('uploader_title'),
                    button: {
                        text: jQuery(this).data('uploader_button_text'),
                    },
                    multiple: true
                });

                file_frame.on('select', function() {
                    var images = file_frame.state().get('selection').toJSON(),
                            length = images.length;
                    for (var i = 0; i < length; i++) {
                        rpggallery.get_thumbnail(images[i]['id']);
                    }
                });
                file_frame.open();
            });

           
        },
        get_thumbnail: function(id, cb) {
            cb = cb || function() {
            };
            var data = {
                action: 'rpggallery_get_thumbnail',
                imageid: id
            };
            jQuery.post(ajaxurl, data, function(response) {
                rpggallery.admin_thumb_ul.append(response);
                cb();
            });
        },
        get_all_thumbnails: function(post_id, included) {
            var data = {
                action: 'rpggallery_get_all_thumbnail',
                post_id: post_id,
                included: included
            };
            jQuery('#rpggallery_spinner').show();
            jQuery.post(ajaxurl, data, function(response) {
                rpggallery.admin_thumb_ul.append(response);
                jQuery('#rpggallery_spinner').hide();
            });
        }
    };
    rpggallery.init();
});