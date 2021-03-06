'use strict';

describe("Unit Tests for Contacts Service", function () {
    var $httpBackend, contactSvc;
    beforeEach(inject(function(_$httpBackend_, _Contact_){
        $httpBackend = _$httpBackend_;
        contactSvc = _Contact_;
    }));

    describe("Testing for Contact retrieval", function() {
        it('should make a get call to list of contacts for test agency', function() {
            $httpBackend
                .whenGET('/v1/contact/REI%20Test%20Agency')
                .respond('{"results":[{"title 2,x,Reddy,x,reddy@reddy.com,x,7034809200,x,,x,REI Way,x,Sterling,x,VA,x,20170":{"_id": "title 2,x,Reddy,x,reddy@reddy.com,x,7034809200,x,,x,REI Way,x,Sterling,x,VA,x,20170", "title":"Reddy, title 2"}}]}');
            var contacts = contactSvc.query({ agencyId: "REI Test Agency" });
            $httpBackend.flush();
            expect(contacts).toBeDefined();
        });

        it('should populate _id if none is present', function() {
            $httpBackend
                .whenGET('/v1/contact/REI%20Test%20Agency')
                .respond('{"results":[{"title 2,x,Reddy,x,reddy@reddy.com,x,7034809200,x,,x,REI Way,x,Sterling,x,VA,x,20170":{"title":"Reddy, title 2"}}]}');
            var contacts = contactSvc.query({ agencyId: "REI Test Agency" });
            $httpBackend.flush();
            expect(contacts).toBeDefined();
            angular.forEach(contacts, function(contact) {
                expect(contact['_id']).toBeDefined();
            });
        });
    });
});
