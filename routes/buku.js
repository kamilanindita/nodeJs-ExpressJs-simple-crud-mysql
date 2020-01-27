var express = require('express');
var router = express.Router();
var connection  = require('../config/db');
 
 
/* GET home page. */
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM buku',function(err,rows){
        if(err){
            req.flash('error', err); 
            res.render('buku/index',{title:"Buku",data:''});   
        }else{   
            res.render('buku/index',{title:"Buku",data:rows});
        }
    });
});
 
 
// SHOW 
router.get('/tambah', function(req, res, next){    
    res.render('buku/tambah', {title: 'Tambah Buku'});
});
 
// ADD 
router.post('/tambah', function(req, res, next){    
    req.assert('penulis', 'Penulis is required').notEmpty();          
    req.assert('judul', 'Judul is required').notEmpty();       
    req.assert('kota', 'Kota is required').notEmpty();        
    req.assert('penerbit', 'Penerbit is required').notEmpty();
    req.assert('tahun', 'Tahun is required').notEmpty();   
 
    var errors = req.validationErrors();
     
    if( !errors ) {   //No errors were found.  Passed Validation!
        var data = {
            penulis:req.sanitize('penulis').escape().trim(),
            judul:req.sanitize('judul').escape().trim(),
            kota:req.sanitize('kota').escape().trim(),
            penerbit:req.sanitize('penerbit').escape().trim(),
            tahun:req.sanitize('tahun').escape().trim()
        }
         
        connection.query('INSERT INTO buku SET ?',data , function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err);
                     
                res.render('buku/tambah', {
                    title: 'Tambah Buku',
                    data:data,                  
                });
            } else {                
                req.flash('success', 'Data added successfully!');
                res.redirect('/buku');
            }
        });
    }
    else {   //Display errors 
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        });                
        req.flash('error', error_msg);        

        res.render('buku/tambah', { 
            title: 'Buku Tambah',
           data:data,
        });
    }
});
 
// SHOW EDIT  FORM
router.get('/edit/:id', function(req, res, next){
    connection.query('SELECT * FROM buku WHERE ?',{ id:req.params.id }, function(err, rows, fields) {
        var data=rows[0];
        if(err) throw err
             
        // if data not found
        if (rows.length <= 0) {
            req.flash('error', 'Buku not found with id = ' + req.params.id)
            res.redirect('/buku')
        }
        else { // if data found
            res.render('buku/edit', {
                title: 'Edit Buku', 
                data:data,                    
            });
        }            
    });
  
});
 
// EDIT POST ACTION
router.post('/update/(:id)', function(req, res, next) {
    var _id= req.params.id;
    req.assert('penulis', 'Penulis is required').notEmpty();          
    req.assert('judul', 'Judul is required').notEmpty();       
    req.assert('kota', 'Kota is required').notEmpty();        
    req.assert('penerbit', 'Penerbit is required').notEmpty();
    req.assert('tahun', 'Tahun is required').notEmpty();   
  
    var errors = req.validationErrors()
     
    if( !errors ) {   
        var data = {
            penulis:req.sanitize('penulis').escape().trim(),
            judul:req.sanitize('judul').escape().trim(),
            kota:req.sanitize('kota').escape().trim(),
            penerbit:req.sanitize('penerbit').escape().trim(),
            tahun:req.sanitize('tahun').escape().trim()
        }
         
        connection.query('UPDATE buku SET ? WHERE ?',[ data, {id: _id} ], function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('buku/edit', {
                    title: 'Edit Buku',
                    data:data,
                })
            } else {
                req.flash('success', 'Data updated successfully!');
                res.redirect('/buku');
            }
        });
         
    }
    else {   //Display errors 
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('buku/edit', { 
            title: 'Edit Buku',            
            data:data,
        });
    }
});
       
// DELETE 
router.get('/delete/:id', function(req, res, next) {
     
    connection.query('DELETE FROM buku WHERE ?',{ id:req.params.id }, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
            // redirect to list page
            res.redirect('/buku')
        } else {
            req.flash('success', 'Buku deleted successfully! id = ' + req.params.id)
            // redirect to  list page
            res.redirect('/buku')
        }
    });
});
 
 
module.exports = router;