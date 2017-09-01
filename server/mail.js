const r = require('./db');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.redirect('/');
})
	.get('/:id', (req, res) => {
		r.table('emails')
			.get(req.params.id)
			.run(r.conn, (err, result) => {
				if (err) {
					res.status(500).render('error.html', { status: 500 });
				} else if (!result) {
					res.status(404).render('error.html', { status: 404 });
				} else {
					const date = new Date(result.timestamp);
					res.render('mail.html', { email: result, datestamp: date.toUTCString() });
				}
			});
	});

module.exports = router;
