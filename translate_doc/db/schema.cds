namespace translation.db;

entity Documents {
    key ID           : UUID;
    fileName         : String;
    mimeType         : String;
    content          : LargeBinary;
    translatedText   : LargeString;
    targetLanguage   : String;
    createdAt        : Timestamp;
}