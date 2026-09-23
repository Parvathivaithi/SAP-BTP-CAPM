namespace translate.srv;

using {translation.db as db} from '../db/schema';

service TranslationService {

    entity Document as projection on db.Documents;

    action translateDocument(
        file          : LargeBinary,
        fileName      : String,
        targetLang    : String
    ) returns String;

}