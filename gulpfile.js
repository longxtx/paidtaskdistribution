// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var sass = require('gulp-sass');    
var concat = require('gulp-concat');   //用于多个文件合并为一个文件
var uglify = require('gulp-uglify');   //用于js压缩
var rename = require('gulp-rename');   //用于重命名
var cssmin=require('gulp-minify-css'); //用于css压缩
var htmlmin = require('gulp-htmlmin'); //用于html压缩
var gutil=require('gulp-util');
var babel= require('gulp-babel');
var clean = require('gulp-clean');

//压缩JS
gulp.task('scripts', function() {
    gulp.src(['./chain/*', './database/*.js','./routes/*','./task/*','app.js'],{ base: '.' })
        .pipe(babel({
                presets: ['es2015'] // es5检查机制
            }))
        .pipe(uglify())
        .on('error', function (err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('./dist'));
});

//压缩html
gulp.task('html', function() {
	 var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        //省略布尔属性的值
        collapseBooleanAttributes: true,
        //删除所有空格作属性值 
        removeEmptyAttributes: true,
        //删除<script>的type="text/javascript"
        removeScriptTypeAttributes: true,
        //删除<style>和<link>的type="text/css"
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['./views/*.html'])
        .pipe(babel({
                presets: ['es2015'] // es5检查机制
         }))
        .pipe(htmlmin(options))
        .on('error', function (err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('./dist/views'));
});

// 搬运
gulp.task('static', function() {
   gulp.src(['./public/**/*','./views/*','./database/*.json','package.json'],{ base: '.'}).pipe(gulp.dest('./dist'));
});
// 搬运
gulp.task('config', function() {
   gulp.src('./config/default.jsond')
   .pipe(rename('default.json'))
   .pipe(gulp.dest('./dist/config'));
});

// 清空目录
gulp.task("clean",function(){
    return gulp.src('./dist',{read:false})
    .pipe(clean());
});

gulp.task('default',['clean'],function(){
   gulp.run('static','scripts','config');
   gulp.watch('./views/*.html',['static']);
});

