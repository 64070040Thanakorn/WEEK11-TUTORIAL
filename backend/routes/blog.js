const express = require("express")
const pool = require("../config")
const upload = require("../multer");

router = express.Router()

router.post("/blogs/search", async function (req, res, next) {
  // Your code here
  try {
    const [rows, fields] = await pool.query("SELECT * FROM blogs WHERE title LIKE ?", [`%${req.query.search}%`]);

    return res.json(rows);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.post("/blogs/addlike/:blogId", async function (req, res, next) {
  //ทำการ select ข้อมูล blog ที่มี id = req.params.blogId
  try{
    const [rows, fields] = await pool.query("SELECT * FROM blogs WHERE id=?", [
      req.params.blogId,
    ]);
    //ข้อมูล blog ที่เลือกจะอยู่ในตัวแปร rows
    console.log('Selected blogs =', rows)
    //สร้างตัวแปรมาเก็บจำนวน like ณ ปัจจุบันของ blog ที่ select มา
    let likeNum = rows[0].like
    console.log('Like num =', likeNum) // console.log() จำนวน Like ออกมาดู
    //เพิ่มจำนวน like ไปอีก 1 ครั้ง
    likeNum += 1

    //Update จำนวน Like กลับเข้าไปใน DB
    const [rows2, fields2] = await pool.query("UPDATE blogs SET blogs.like=? WHERE blogs.id=?", [
      likeNum, req.params.blogId,
    ]);

    // return json response
    return res.json({
      blogId: Number(req.params.blogId),
      likeNum: likeNum
    })
  } catch (err) {
    res.json(err)
  }
});

router.post("/blogs", upload.single('blog_image'), async function (req, res, next) {
  const file = req.file;
    
    const title = req.body.title;
    const content = req.body.content;
    const status = req.body.status;
    const pinned = req.body.pinned;
    
    if (!file || !title || !content || !status || !pinned ) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return res.json(error)
    }
    const conn = await pool.getConnection()
    // Begin transaction
    await conn.beginTransaction();
    try {
      let results = await conn.query(
        "INSERT INTO blogs(title, content, status, pinned, `like`, create_date) VALUES(?, ?, ?, ?, 0,CURRENT_TIMESTAMP);",
        [title, content, status, pinned]
      )
      const blogId = results[0].insertId;
  
      await conn.query(
        "INSERT INTO images(blog_id, file_path, main) VALUES(?, ?, ?);",
        [blogId, file.path.substr(6), 1])
  
      await conn.commit()
      res.redirect("/")
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      console.log('finally')
      conn.release();
    }
  });

router.get("/blogs/:id", function (req, res, next) {
  const promise1 = pool.query("SELECT * FROM blogs WHERE id=?", [req.params.id]);
  const promise2 = pool.query("SELECT * FROM comments c LEFT OUTER JOIN images i ON (c.id = i.comment_id) WHERE c.blog_id=? ORDER BY c.comment_date", [req.params.id]);
  const promise3 = pool.query("SELECT * FROM images WHERE blog_id=? AND comment_id IS NULL", [req.params.id]);

  Promise.all([promise1, promise2, promise3])
    .then((results) => {
      const blogs = results[0];
      const comments = results[1];
      const images = results[2];
      // console.log(comments[0]);
      // console.log(images[0][0]);
      res.json({
        blog: blogs[0][0],
        comments: comments[0],
        images: images[0],
        error: null,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

router.put("/blogs/:id", function (req, res) {
  // Your code here
  return;
});

router.delete("/blogs/:id", function (req, res) {
  // Your code here
  return;
});

exports.router = router;
