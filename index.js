const express = require('express');

const app = express();

const port = 3000;

const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize({   // 시퀄라이즈를 사용하기 위한 객체 생성& 변수에 할당
    dialect:'sqlite',              // 데이터베이스로 에스큐라이트를 사용
    storage: './database.sqlite'     // 에스큐라이트를 통해 관리되는 데이터 파일의 저장 겅로 지정
});

const Comments = sequelize.define('Comments',{
   content:{                                     //content 칼럼의 데이터 타입과 기타 설정 정의
          type: DataTypes.STRING,                // 데이터 타입을 STRING(문자열) 정의
          allowNull: false                       // 데이터는 Null(빈 값)을 허용하지 않음. Null 값 넣으면 오류 발생
   }
});

(async () => {
 await Comments.sync({force: true}); 
 console.log("The table for the User model was just (re)created!")
})();

























let comments = []; // 댓글 데이터가 담기는 배열을 comments 변수에 할당
                   // 댓글이 등록될 때마다 데이터가 변경되므로 변수 상자 let 사용

app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs');



app.get('/',async (req, res) => { // findAll() 함수로 데이터 조회 > async/await 코드 추가
  const comments = await Comments.findAll(); 
  res.render('index', {comments: comments});
});                         // comments 테이블의 데이터를 조회하여 comments 변수에 넣기









// app.get('/', (req, res) => { // 댓글 데이터를 '/' 경로의 페이지에서 조회할 수 있도록 하기
//   res.render('index', {comments: comments});
// });

// app.post('/create', (req, res) => {
//   console.log(req.body); 
//   const{content} = req.body; // content를 name으로 갖는 데이터 가져오기
//   comments.push(content); // comments 배열에 데이터 넣어주기
//   res.redirect('/'); // post 요청이 정상 처리되면 '/' 경로로 페이지 이동
// });

app.post('/create',async (req, res) => {     // create() 함수로 데이터를 생성 > async 코드 추가
  console.log(req.body); 
  const{content} = req.body; 
  const comment = await Comments.create({content: content}); // content 데이터를 comments 테이블의 content 칼럼에 입력하여 데이터 생성
  console.log(comment.id);    // 생성된 데이터에 각 레코드를 구분할 수 있는 유일한 값인 아이디가 할당됨
  res.redirect('/'); // post 요청이 정상 처리되면 '/' 경로로 페이지 이동
});



app.post('/update/:id', async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const {id} = req.params;   // 파라미터에서 아이디값 가져오기
  const {content} = req.body;
  // 테이블의 데이터 중 파라미터의 아이디값과 일치하는 것에 content값 덮어쓰기
    await Comments.update({content: content}, {    // content : content = 칼럼 : 요청 본문
      where: {
        id: id           // id:id= 칼럼 : 파라미터
      }
    });
  res.redirect('/'); 
  });



  app.post('/delete/:id', async (req, res) => {
    console.log(req.params);
    const {id} = req.params; // 데이터 중 파라미터의 아이디값과 일치하는 것 삭제
    await Comments.destroy({
      where: {
        id: id
      }
    });
    res.redirect('/');
  });











  
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});