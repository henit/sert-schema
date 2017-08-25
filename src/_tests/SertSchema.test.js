import test from 'ava';
import SertSchema from '../SertSchema';
import bookSchema from 'testdata/got/schemas/book.json';
import book1 from 'testdata/got/books/book1.json';
import bookInvalid from 'testdata/got/books/bookInvalid.json';

test('.validate return undefined for valid subjects', t => {
    t.is(SertSchema.validate(bookSchema, book1), undefined);
});

test('.validate return error for invalid subjects', t => {
    let err1 =  SertSchema.validate(bookSchema, bookInvalid);
    t.true(err1 instanceof Error);

    t.true(['summary', 'details', 'messages', 'propMessages'].every(prop => Boolean(err1[prop])));

    t.is(err1.message, 'Invalid Book');
    t.is(err1.status, undefined);
    t.is(err1.summary, 'Additional properties not allowed at path "/publishedAt"');
    t.is(err1.details, 'Additional properties not allowed at path "/publishedAt".');
    t.is(err1.status, undefined);

    // With message and status
    let err2 = SertSchema.validate(bookSchema, bookInvalid, { message: 'Wrong book.', status: 418 });
    t.true(err2 instanceof Error);
    t.true(['status', 'summary', 'details', 'messages', 'propMessages'].every(prop => Boolean(err2[prop])));
    t.is(err2.message, 'Wrong book.');
    t.is(err2.summary, 'Additional properties not allowed at path "/publishedAt"');
    t.is(err2.details, 'Additional properties not allowed at path "/publishedAt".');
    t.is(err2.status, 418);
});


test('.assertValid return the subject', t => {
    const res = SertSchema.assertValid(bookSchema, book1);
    t.is(res, book1);
});

test('.assertValid pass valid subjects', t => {
    SertSchema.assertValid(bookSchema, book1);
});

test('.assertValid throw error for invalid subjects', t => {
    t.throws(() => SertSchema.assertValid(bookSchema, bookInvalid));
});


test('.isValid return true for valid subjects', t => {
    t.true(SertSchema.isValid(bookSchema, book1));
});

test('.isValid return false for invalid subjects', t => {
    t.false(SertSchema.isValid(bookSchema, bookInvalid));
});
