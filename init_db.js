var elastic = require("./elasticsearch_");

// elastic._get_mappings({index:'identity', type: 'user'}, function(resp){
//     console.log(resp.identity.mappings.user);
// }).then(function(data){
//     console.log("Promise Handled");
// })

elastic._create_indices('identity', function(resp){
    elastic._put_mapping( console.log);    
});
// elastic._delete_indices('identity', console.log);
