import { useState, useEffect } from "react";
import { Star, Check } from "lucide-react";

export default function CleaningServiceReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [serviceCategory, setServiceCategory] = useState("");
  const maxChars = 500;

  const categories = [
    "1회 청소",
    "정기 청소(매일)",
    "정기 청소(매주)",
    "정기 청소(매달)",
    "구역 청소"
  ];

  // Update character count when review changes
  useEffect(() => {
    setCharCount(review.length);
  }, [review]);

  // Handle review text change
  const handleReviewChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setReview(text);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    alert(`리뷰가 제출되었습니다!\n카테고리: ${serviceCategory}\n별점: ${rating}점\n리뷰: ${review}`);
    // 여기에 실제 제출 로직 추가
    setRating(0);
    setReview("");
    setServiceCategory("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-sky-700 mb-6 text-center">
          청소 서비스 리뷰 작성
        </h1>
        
        <div className="space-y-6">
          {/* 서비스 카테고리 선택 섹션 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              서비스 카테고리
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    serviceCategory === category
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-gray-200 hover:border-sky-300 hover:bg-sky-50"
                  }`}
                  onClick={() => setServiceCategory(category)}
                >
                  <div className={`w-5 h-5 mr-2 flex-shrink-0 rounded-full border flex items-center justify-center ${
                    serviceCategory === category
                      ? "border-sky-500 bg-sky-500"
                      : "border-gray-300"
                  }`}>
                    {serviceCategory === category && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-sm">{category}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 별점 선택 섹션 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              서비스 만족도
            </label>
            <div className="flex justify-center items-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="mx-1">
                  <Star
                    size={36}
                    className={`cursor-pointer ${
                      (hoverRating || rating) >= star
                        ? "fill-sky-400 text-sky-400"
                        : (hoverRating || rating) >= star - 0.5
                          ? "fill-sky-400 text-sky-400"
                          : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    strokeWidth={1.5}
                  />
                </div>
              ))}
            </div>
            <p className="text-center text-sky-600 font-medium mt-2">
              {rating > 0 ? `${rating}점` : "별점을 선택해주세요"}
            </p>
          </div>
          
          {/* 리뷰 작성 섹션 */}
          <div className="space-y-2">
            <label htmlFor="review" className="block text-sm font-medium text-gray-700">
              리뷰 내용
            </label>
            <div className="relative">
              <textarea
                id="review"
                value={review}
                onChange={handleReviewChange}
                placeholder="서비스에 대한 솔직한 의견을 작성해주세요..."
                className="w-full h-36 p-4 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition"
                maxLength={maxChars}
              />
              <div className="absolute bottom-2 right-3 text-sm text-gray-500">
                {charCount}/{maxChars}
              </div>
            </div>
          </div>
          
          {/* 제출 버튼 */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={!serviceCategory || rating === 0 || review.trim() === ""}
              className={`w-full py-3 rounded-lg text-white font-medium transition 
                ${
                  !serviceCategory || rating === 0 || review.trim() === ""
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600"
                }`}
            >
              리뷰 제출하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}