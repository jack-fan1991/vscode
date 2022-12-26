class Person {
  /// The generated code assumes these values exist in JSON.
  final String firstName, lastName;

  /// The generated code below handles if the corresponding JSON value doesn't
  /// exist or is empty.
  final DateTime? dateOfBirth;

  Person({required this.firstName, required this.lastName, this.dateOfBirth});

  /// Connect the generated [_$PersonFromJson] function to the `fromJson`
  /// factory.
const factory Person.name() => Person();
  /// Connect the generated [_$PersonToJson] function to the `toJson` method.
  factory Person.fromJson(Map<String, dynamic> json) => _$PersonFromJson(json);
  Map<String, dynamic> toJson() => _$PersonToJson(this);
  factory test_event.fromJson(Map<String, dynamic> json) => _$test_eventFromJson(json);
  Map<String, dynamic> toJson() => _$test_eventToJson(this);
}

  factory :CLIPBOARD.fromJson(Map<String, dynamic> json) => _$FromJson(json);
  Map<String, dynamic> toJson() => _$ToJson(this);

  factory TM_FILENAME_BASE.fromJson(Map<String, dynamic> json) => _$TM_FILENAME_BASEFromJson(json);
  Map<String, dynamic> toJson() => _$TM_FILENAME_BASEToJson(this);
  factory ewr.fromJson(Map<String, dynamic> json) => _$ewrFromJson(json);
  Map<String, dynamic> toJson() => _$ewrToJson(this);
  

  factory Person.fromJson(Map<String, dynamic> json) => _$PersonFromJson(json);
  Map<String, dynamic> toJson() => _$PersonToJson(this);


  factory Clipboard.fromJson(Map<String, dynamic> json) => _$ClipboardFromJson(json);
  Map<String, dynamic> toJson() => _$ClipboardToJson(this);


factory TM_FILENAME_BASE.fromJson(Map<String, dynamic> json) => _$TM_FILENAME_BASEFromJson(json);
Map<String, dynamic> toJson() => _$TM_FILENAME_BASEToJson(this);