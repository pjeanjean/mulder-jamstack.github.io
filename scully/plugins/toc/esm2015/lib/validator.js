var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPluginConfig } from '@scullyio/scully';
import { TocPluginName } from './constants';
export const validator = ( /* conf */) => __awaiter(void 0, void 0, void 0, function* () {
    const tocConfig = getPluginConfig(TocPluginName);
    const errors = [];
    if (!tocConfig.insertSelector.length) {
        errors.push('Option "insertSelector" for "toc" must be a valid string (e.g. "#toc").');
    }
    if (!tocConfig.blogAreaSelector.length) {
        errors.push('Option "blogAreaSelector" for "toc" must be a valid string (e.g. ".blog-content").');
    }
    if (tocConfig.level && !tocConfig.level.length) {
        errors.push(`Option "level" for "toc" must be an array containing headings to list (e.g.: "['h2', 'h3']".`);
    }
    return errors;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9kYW5ueWtvcHBlbmhhZ2VuL2Rldi9zY3VsbHktcGx1Z2luLXRvYy9wcm9qZWN0cy9zY3VsbHktcGx1Z2luLXRvYy9zcmMvIiwic291cmNlcyI6WyJsaWIvdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUduRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRTVDLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxFQUFPLFVBQVUsRUFBRSxFQUFFO0lBQzVDLE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FBWSxhQUFhLENBQUMsQ0FBQztJQUM1RCxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFFNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQ1QseUVBQXlFLENBQzFFLENBQUM7S0FDSDtJQUVELElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQ1Qsb0ZBQW9GLENBQ3JGLENBQUM7S0FDSDtJQUVELElBQUksU0FBUyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQ1QsOEZBQThGLENBQy9GLENBQUM7S0FDSDtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0UGx1Z2luQ29uZmlnIH0gZnJvbSAnQHNjdWxseWlvL3NjdWxseSc7XG5cbmltcG9ydCB7IFRvY0NvbmZpZyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBUb2NQbHVnaW5OYW1lIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdG9yID0gYXN5bmMgKC8qIGNvbmYgKi8pID0+IHtcbiAgY29uc3QgdG9jQ29uZmlnID0gZ2V0UGx1Z2luQ29uZmlnPFRvY0NvbmZpZz4oVG9jUGx1Z2luTmFtZSk7XG4gIGNvbnN0IGVycm9yczogc3RyaW5nW10gPSBbXTtcblxuICBpZiAoIXRvY0NvbmZpZy5pbnNlcnRTZWxlY3Rvci5sZW5ndGgpIHtcbiAgICBlcnJvcnMucHVzaChcbiAgICAgICdPcHRpb24gXCJpbnNlcnRTZWxlY3RvclwiIGZvciBcInRvY1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgKGUuZy4gXCIjdG9jXCIpLicsXG4gICAgKTtcbiAgfVxuXG4gIGlmICghdG9jQ29uZmlnLmJsb2dBcmVhU2VsZWN0b3IubGVuZ3RoKSB7XG4gICAgZXJyb3JzLnB1c2goXG4gICAgICAnT3B0aW9uIFwiYmxvZ0FyZWFTZWxlY3RvclwiIGZvciBcInRvY1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgKGUuZy4gXCIuYmxvZy1jb250ZW50XCIpLicsXG4gICAgKTtcbiAgfVxuXG4gIGlmICh0b2NDb25maWcubGV2ZWwgJiYgIXRvY0NvbmZpZy5sZXZlbC5sZW5ndGgpIHtcbiAgICBlcnJvcnMucHVzaChcbiAgICAgIGBPcHRpb24gXCJsZXZlbFwiIGZvciBcInRvY1wiIG11c3QgYmUgYW4gYXJyYXkgY29udGFpbmluZyBoZWFkaW5ncyB0byBsaXN0IChlLmcuOiBcIlsnaDInLCAnaDMnXVwiLmAsXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBlcnJvcnM7XG59O1xuIl19