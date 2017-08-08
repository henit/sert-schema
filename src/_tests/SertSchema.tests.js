import { expect } from 'chai';
import SertSchema from '../SertSchema';
import bookSchema from 'testdata/got/schemas/book.json';
import book1 from 'testdata/got/books/book1.json';
import bookInvalid from 'testdata/got/books/bookInvalid.json';

describe('SertSchema', () => {
    describe('.validate()', () => {
        it('should return undefined for valid subjects', () => {
            expect(SertSchema.validate(bookSchema, book1)).to.be.undefined;
        });

        it('should return error for invalid subjects', () => {
            let err1 =  SertSchema.validate(bookSchema, bookInvalid);
            expect(err1).to.be.instanceof(Error);
            expect(err1).to.have.keys(['summary', 'details', 'messages', 'propMessages']);
            expect(err1.message).to.equal('Invalid Book');
            expect(err1.status).to.be.undefined;
            expect(err1.summary).to.equal('Additional properties not allowed at path "/publishedAt"');
            expect(err1.details).to.equal('Additional properties not allowed at path "/publishedAt".');
            expect(err1.status).to.be.undefined;

            // With message and status
            let err2 = SertSchema.validate(bookSchema, bookInvalid, { message: 'Wrong book.', status: 418 });
            expect(err2).to.be.instanceof(Error);
            expect(err2).to.have.keys(['status', 'summary', 'details', 'messages', 'propMessages']);
            expect(err2.message).to.equal('Wrong book.');
            expect(err2.summary).to.equal('Additional properties not allowed at path "/publishedAt"');
            expect(err2.details).to.equal('Additional properties not allowed at path "/publishedAt".');
            expect(err2.status).to.equal(418);
        });
    });

    describe('.assertValid()', () => {
        it('should return the subject', () => {
            const res = SertSchema.assertValid(bookSchema, book1);
            expect(res).to.equal(book1);
        });

        it('should pass valid subjects', () => {
            SertSchema.assertValid(bookSchema, book1);
        });

        it('should throw error for invalid subjects', () => {
            expect(() => SertSchema.assertValid(bookSchema, bookInvalid)).to.throw(Error);
        });
    });

    describe('.isValid()', () => {
        it('should return true for valid subjects', () => {
            expect(SertSchema.isValid(bookSchema, book1)).to.be.true;
        });

        it('should return false for invalid subjects', () => {
            expect(SertSchema.isValid(bookSchema, bookInvalid)).to.be.false;
        });
    });

});
